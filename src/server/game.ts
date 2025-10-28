import Cards from "./cards.js";
import Board from "./board.js";
import abilities from "./abilities.js";
import factions from "./factions.js";
import type {GameOptions, GamePlayer, PlayerId, RoundResult} from "./types/game.js";
import type {CardData, UnitRow} from "@shared/types/card.js";
import type Listeners from "./listeners.js";
import type {PlayerBoard, Play, State} from "@shared/types/game.js";

type Effect = {
    once: boolean;
    run: () => Promise<void>;
};

export default class Game {
    private options: GameOptions;
    public players: Record<PlayerId, GamePlayer>;
    public currentPlayerId: PlayerId;
    private roundResults: RoundResult[];
    public onGameStart: Effect[];
    public onRoundStart: Effect[];
    public onRoundEnd: Effect[];
    public board: Board;
    public listeners: Listeners;

    constructor(listeners: Listeners, players: Record<PlayerId, GamePlayer>) {
        this.listeners = listeners;
        this.board = new Board(this.getOptions.bind(this), Object.keys(players));
        this.roundResults = [];
        this.onGameStart = [];
        this.onRoundStart = [];
        this.onRoundEnd = [];
        this.options = {
            doubleSpyPower: false,
            halfWeather: false,
            randomRespawn: false,
        };
        this.players = players;
    }

    private getPlayerIds(): PlayerId[] {
        return Object.keys(this.players);
    }

    private getPlayers(): {id: PlayerId, player: GamePlayer}[] {
        return Object.entries(this.players).map(([id, player]) => ({
            id,
            player,
        }));
    }

    private tossCoin(): void {
        this.currentPlayerId = this.getPlayerIds()[Math.round(Math.random())];
        this.getPlayerIds().forEach((id) => this.listeners.notify(id, `coin_${this.currentPlayerId === id ? "me" : "op"}`));
    }

    enableDoubleSpyPower(): void {
        this.options.doubleSpyPower = true;
    }

    enableRandomRespawn(): void {
        this.options.randomRespawn = true;
    }

    enableHalfWeather(): void {
        this.options.halfWeather = true;
    }

    disableLeaders(): void {
        this.getPlayers().forEach(({player}) => player.isLeaderAvailable = false);
    }

    getOpponentId(playerId: PlayerId): PlayerId {
        return this.getPlayerIds().find((id) => playerId !== id);
    }

    getPlayer(playerId: PlayerId): GamePlayer {
        return this.players[playerId];
    }

    getPlayerCards(playerId: PlayerId): Cards {
        return this.getPlayer(playerId).cards;
    }

    getOptions(): GameOptions {
        return this.options;
    }

    getRoundCount(): number {
        return this.roundResults.length + 1;
    }

    getLastRoundResult(): RoundResult|null {
        if (this.roundResults.length === 0) {
            return null;
        }

        return this.roundResults[this.roundResults.length - 1];
    }

    playersHaveSameFaction(): boolean {
        const [firstFaction, secondFaction] = this.getPlayers().map(({player}) => player.faction);

        return firstFaction === secondFaction;
    }


    scorch(rowName?: UnitRow, playerId?: PlayerId): void {
        const rows = this.getPlayerIds()
            .filter((id) => !playerId || id === playerId)
            .map((id) => ({
                id,
                board: this.board.getPlayerBoard(id),
            }))
            .flatMap(({id, board}) => Object.entries(board)
                .filter(([name]) => !rowName || rowName === name)
                .map(([_, row]) => ({row, id})));

        const maxScore = Math.max(...rows.flatMap(({row}) => row
            .getUnits()
            .filter((card) => !card.abilities.includes("hero") && !card.abilities.includes("decoy"))
            .map((card) => row.getCardScore(card))));

        rows.forEach(({row, id}) => row.remove(...row.getUnits()
            .filter((card) => {
                if (row.getCardScore(card) !== maxScore || card.abilities.includes("hero") || card.abilities.includes("decoy")) {
                    return false;
                }

                this.getPlayer(id).cards.discard(card);
                return true;
            })));
    }

    private static async runEffects(effects: Effect[]): Promise<Effect[]> {
        await Promise.all(effects.map(async ({run}) => await run()));

        return effects.filter(({once}) => !once);
    }

    private sendState(): void {
        const players = Object.fromEntries(this.getPlayers().map(({id, player: {cards, ...player}}) => [id, {
            ...player,
            ...cards,
        }]));

        const board = Object.fromEntries(this.getPlayerIds().map((id) => {
            const playerBoard = this.board.getPlayerBoard(id);

            return [id, Object.fromEntries(
                Object.entries(playerBoard).map(([rowName, row]) => [
                    rowName, {
                        special: row.special,
                        units: row.units.map((card) => ({
                            card,
                            score: row.getCardScore(card),
                        })),
                    },
                ]),
            ) as PlayerBoard];
        }));

        Object.keys(players).forEach((id) => {
            const {deck, hand, ...rest} = players[this.getOpponentId(id)];

            const state: State = {
                turn: this.currentPlayerId === id ? "me" : "opponent",
                players: {
                    me: players[id],
                    opponent: {
                        ...rest,
                        deckSize: deck.length,
                        handSize: hand.length,
                    },
                },
                board: {
                    rows: {
                        me: board[id],
                        opponent: board[this.getOpponentId(id)],
                    },
                    weather: this.board.getWeather(),
                },
            };

            this.listeners.sendState(id, state);
        });
    }

    async playGame(): Promise<void> {
        this.sendState();

        await this.startGame();

        while (this.getPlayers().every(({player}) => player.gems)) {
            await this.startRound();

            this.sendState();

            while (!this.getPlayers().every(({player}) => player.hasPassed)) {
                this.startTurn();

                if (!this.getPlayer(this.currentPlayerId).hasPassed) {
                    let ok = false;
                    while (!ok) {
                        const play = await this.listeners.askPlay(this.currentPlayerId);

                        ok = await this.executePlay(play);
                    }
                }

                this.currentPlayerId = this.getOpponentId(this.currentPlayerId);

                this.sendState();
            }

            await this.endRound();
        }

        const winner = this.getPlayers().find(({player}) => player.gems)?.id ?? null;
        this.getPlayerIds().forEach((id) => this.listeners.showResults(id, this.roundResults, winner));
    }

    private async startGame(): Promise<void> {
        this.getPlayers().forEach(({id, player}) => {
            player.cards.deck = Cards.shuffle(player.cards.deck);

            player.leader.abilities.forEach((ability) => {
                abilities[ability]?.onGameStart?.(this, id);
            });

            factions[player.faction](this, id);

            player.cards.draw(10);
        });

        this.onGameStart = await Game.runEffects(this.onGameStart);

        if (!this.currentPlayerId) {
            this.tossCoin();
        }

        this.sendState();

        await Promise.all(this.getPlayers().map(async ({id, player}) => {
            let startIndex = 0;
            for (let i = 0; i < 2; ++i) {
                const {deck, hand} = player.cards;
                if (!deck.length || !hand.length) {
                    break;
                }

                const selection = await this.listeners.selectCard(id, hand, true, startIndex);
                if (!selection) {
                    break;
                }
                startIndex = selection.index;

                player.cards.redraw(selection.item);
                this.sendState();
            }

            this.listeners.notify(id, "waiting_for_opponent");
        }));
    }

    private async startRound(): Promise<void> {
        this.getPlayers().forEach(({id, player}) => {
            player.hasPassed = false;
            this.listeners.notify(id, "start_round");
        });

        const lastRoundResult = this.getLastRoundResult();
        if (lastRoundResult) {
            if (lastRoundResult.winner) {
                this.currentPlayerId = lastRoundResult.winner;

                this.getPlayerIds().forEach((id) => this.listeners.notify(id, `first_${this.currentPlayerId === id ? "me" : "op"}`));
            } else {
                this.tossCoin();
            }
        }

        this.onRoundStart = await Game.runEffects(this.onRoundStart);
    }

    private startTurn(): void {
        this.getPlayerIds().forEach((id) => this.listeners.notify(id, `turn_${this.currentPlayerId === id ? "me" : "op"}`));

        const player = this.getPlayer(this.currentPlayerId);

        const canPlay = (player.cards.hand.length > 0 || player.isLeaderAvailable) && !player.hasPassed;
        if (!canPlay) {
            player.hasPassed = true;
        }
    }

    private async endRound(): Promise<void> {
        const scores = Object.fromEntries(this.getPlayerIds().map((id) => [id, this.board.getPlayerScore(id)]));
        const [firstScore, secondScore] = Object.entries(scores)
            .map(([id, score]) => ({id, score}));

        let winner: PlayerId|null = firstScore.score > secondScore.score ?
                firstScore.id :
                secondScore.id;
        if (firstScore.score === secondScore.score) {
            winner = null;
        }

        this.roundResults.push({
            winner,
            scores,
        });

        this.getPlayers().filter(({id}) => id !== winner)
            .forEach(({player}) => --player.gems);

        this.onRoundEnd = await Game.runEffects(this.onRoundEnd);

        this.getPlayers().forEach(({id, player}) => {
            Object.entries(this.board.getPlayerBoard(id))
                .forEach(([rowName, row]) => {
                    const toDiscard = [
                        ...row.getUnits(),
                        ...row.getSpecial(),
                        ...this.board.getPlayerWeather(id),
                    ];

                    toDiscard.forEach((c) => this.removeCard(c, id, rowName as UnitRow));

                    player.cards.discard(...toDiscard);
                });

            const result = winner === null ?
                "draw" :
                winner === id ?
                    "win" :
                    "lose";
            this.listeners.notify(id, `${result}_round`);
        });

        this.board.clear();
    }

    private async removeCard(card: CardData, playerId: PlayerId, row: UnitRow): Promise<void> {
        card.abilities.forEach((ability) => abilities[ability]?.onRemoved?.(this, playerId, row, card));
    }

    private async executePlay(play: Play): Promise<boolean> {
        if (this.getPlayer(this.currentPlayerId).hasPassed) {
            throw new Error("cannot execute play on a player who passed");
        }

        switch (play.type) {
        case "pass":
            this.getPlayer(this.currentPlayerId).hasPassed = true;
            this.getPlayerIds().forEach((id) => this.listeners.notify(id, `pass_${this.currentPlayerId === id ? "me" : "op"}`));

            return true;
        case "leader": {
            const {leader, isLeaderAvailable} = this.getPlayer(this.currentPlayerId);
            if (!isLeaderAvailable) {
                return false;
            }

            const ok = this.playCard(leader, this.currentPlayerId);
            if (!ok) {
                return false;
            }

            this.getPlayer(this.currentPlayerId).isLeaderAvailable = false;

            return true;
        }
        case "card": {
            const card = this.getPlayer(this.currentPlayerId).cards.hand.find(({filename}) => filename === play.card);
            if (!card) {
                return false;
            }

            return this.playCard(card, this.currentPlayerId, play.row);
        }
        }
    }

    async playCard(card: CardData, playerId: PlayerId, row?: UnitRow) : Promise<boolean> {
        switch (card.type) {
        case "weather":
            this.getPlayer(playerId).cards.play(card);

            this.board.playWeather(card, playerId);

            await this.placeCard(card, playerId, null);

            return true;
        case "special": {
            if (!row) {
                return false;
            }

            this.getPlayer(playerId).cards.play(card);

            this.board.playSpecial(card, playerId, row);

            await this.placeCard(card, playerId, row);

            return true;
        }
        case "unit": {
            const r = row ?? (card.abilities.includes("agile") ? "close" : card.rows[0]);

            const playerRow = card.abilities.includes("spy") ?
            this.getOpponentId(playerId) :
            playerId;

            const ok = this.board.playUnit(card, playerRow, r);
            if (!ok) {
                return false;
            }

            this.getPlayer(playerId).cards.play(card);

            await this.placeCard(card, playerId, r);

            return true;
        }
        case "leader":
            await this.placeCard(card, playerId, null);

            return true;
        }
    }

    private async placeCard(card: CardData, playerId: PlayerId, row: UnitRow|null): Promise<void> {
        await Promise.all(card.abilities.map(async (ability) => {
            await abilities[ability]?.onPlaced?.(this, playerId, row, card);
        }));
    }
}
