import Cards from "./cards.js";
import Board from "./board.js";
import abilities from "./abilities.js";
import factions from "./factions.js";
import type {GameOptions, PlayerIndex, RoundResult} from "./types/game.js";
import type {CardData, LeaderCardData, UnitRow} from "@shared/types/card.js";
import type Listeners from "./listeners.js";
import type {PlayerBoard, Play, State, Player} from "@shared/types/game.js";
import type {Matchmake} from "@shared/types/matchmake.js";

type GamePlayer = Omit<Player, "grave"> & {
    cards: Cards;
};

type Effect = {
    once: boolean;
    run: () => Promise<void>;
};

export default class Game {
    private options: GameOptions;
    public players: GamePlayer[];
    public currentPlayerIndex: PlayerIndex;
    private roundResults: RoundResult[];
    public onGameStart: Effect[];
    public onRoundStart: Effect[];
    public onRoundEnd: Effect[];
    public board: Board;
    public listeners: Listeners;

    constructor(listeners: Listeners, requests: Matchmake[]) {
        this.listeners = listeners;
        this.board = new Board(this.getOptions.bind(this));
        this.currentPlayerIndex = 0;
        this.roundResults = [];
        this.onGameStart = [];
        this.onRoundStart = [];
        this.onRoundEnd = [];
        this.options = {
            doubleSpyPower: false,
            halfWeather: false,
            randomRespawn: false,
        };
        this.players = requests.map(({deck, ...player}) => ({
            ...player,
            leader: deck.leader,
            cards: new Cards(deck.cards),
            isLeaderAvailable: true,
            gems: 2,
            hasPassed: false,
        }));
    }

    private tossCoin(): void {
        this.currentPlayerIndex = Math.round(Math.random());
        this.players.forEach((_, i) => this.listeners.notify(i, `coin_${this.currentPlayerIndex === i ? "me" : "op"}`));
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
        this.players.forEach((player) => player.isLeaderAvailable = false);
    }

    getOpponentIndex(playerIndex: PlayerIndex): PlayerIndex {
        return (playerIndex + 1) % this.players.length;
    }

    getPlayer(playerIndex: PlayerIndex): GamePlayer {
        return this.players[playerIndex];
    }

    getPlayerCards(playerIndex: PlayerIndex): Cards {
        return this.players[playerIndex].cards;
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
        const [firstPlayer, secondPlayer] = this.players;

        return firstPlayer.faction === secondPlayer.faction;
    }


    scorch(rowName?: UnitRow, playerIndex?: PlayerIndex): void {
        const rows = this.players
            .filter((_, i) => playerIndex === undefined || i === playerIndex)
            .map((_, i) => this.board.getPlayerBoard(i))
            .flatMap((playerBoard, i) => Object.entries(playerBoard)
                .filter(([name]) => !rowName || rowName === name)
                .map(([_, row]) => ({
                    row,
                    i,
                })));

        const maxScore = Math.max(...rows.flatMap(({row}) => row
            .getUnits()
            .filter((card) => !card.abilities.includes("hero"))
            .map((card) => row.getCardScore(card))));

        rows.forEach(({row, i}) => row.remove(...row
            .getUnits()
            .filter((card) => {
                if (row.getCardScore(card) !== maxScore || card.abilities.includes("hero")) {
                    return false;
                }

                this.players[i].cards.discard(card);
                return true;
            })));
    }

    private static async runEffects(effects: Effect[]): Promise<Effect[]> {
        await Promise.all(effects.map(async ({run}) => await run()));

        return effects.filter(({once}) => !once);
    }

    private sendState(): void {
        const players = this.players.map(({cards, ...player}) => ({
            ...player,
            ...cards,
        }));

        const board = this.players.map((_, i) => {
            const playerBoard = this.board.getPlayerBoard(i);

            return Object.fromEntries(
                Object.entries(playerBoard).map(([rowName, row]) => [
                    rowName, {
                        special: row.special,
                        units: row.units.map((card) => ({
                            card,
                            score: row.getCardScore(card),
                        })),
                    },
                ]),
            ) as PlayerBoard;
        });

        this.players.forEach((_, i) => {
            const {deck, hand, ...rest} = players[this.getOpponentIndex(i)];

            const state: State = {
                turn: this.currentPlayerIndex === i ? "me" : "opponent",
                players: {
                    me: players[i],
                    opponent: {
                        ...rest,
                        deckSize: deck.length,
                        handSize: hand.length,
                    },
                },
                board: {
                    rows: {
                        me: board[i],
                        opponent: board[this.getOpponentIndex(i)],
                    },
                    weather: this.board.getWeather(),
                },
            };

            this.listeners.sendState(i, state);
        });
    }

    async playGame(): Promise<void> {
        this.sendState();

        await this.startGame();

        while (this.players.every(({gems}) => gems)) {
            await this.startRound();

            this.sendState();

            while (!this.players.every(({hasPassed}) => hasPassed)) {
                this.startTurn();

                if (!this.players[this.currentPlayerIndex].hasPassed) {
                    let ok = false;
                    while (!ok) {
                        const play = await this.listeners.askPlay(this.currentPlayerIndex);

                        ok = await this.executePlay(play);
                    }
                }

                this.currentPlayerIndex = this.getOpponentIndex(this.currentPlayerIndex);

                this.sendState();
            }

            await this.endRound();
        }

        let winner: PlayerIndex|null = this.players.findIndex((player) => player.gems);
        if (winner === -1) {
            winner = null;
        }
        this.players.forEach((_, i) => this.listeners.showResults(i, this.roundResults, winner));
    }

    private async startGame(): Promise<void> {
        this.players.forEach((player, i) => {
            player.cards.deck = Cards.shuffle(player.cards.deck);

            player.leader.abilities.forEach((ability) => {
                abilities[ability]?.onGameStart?.(this, i);
            });

            factions[player.faction](this, i);

            player.cards.draw(10);
        });

        this.onGameStart = await Game.runEffects(this.onGameStart);

        if (!this.currentPlayerIndex) {
            this.tossCoin();
        }

        this.sendState();

        await Promise.all(this.players.map(async (player, playerIndex) => {
            let startIndex = 0;
            for (let i = 0; i < 2; ++i) {
                if (!player.cards.deck.length) {
                    break;
                }

                const {hand} = player.cards;
                const [card] = await this.listeners.selectCards(playerIndex, hand, 1, true, startIndex);
                startIndex = hand.findIndex(({filename}) => filename === card.filename);
                if (!card) {
                    break;
                }

                player.cards.redraw(card);
                this.sendState();
            }
        }));
    }

    private async startRound(): Promise<void> {
        this.players.forEach((player, i) => {
            player.hasPassed = false;
            this.listeners.notify(i, "start_round");
        });

        const lastRoundResult = this.getLastRoundResult();
        if (lastRoundResult) {
            if (lastRoundResult.winner) {
                this.currentPlayerIndex = lastRoundResult.winner;

                this.players.forEach((_, i) => this.listeners.notify(i, `first_${this.currentPlayerIndex === i ? "me" : "op"}`));
            } else {
                this.tossCoin();
            }
        }

        this.onRoundStart = await Game.runEffects(this.onRoundStart);
    }

    private startTurn(): void {
        this.players.forEach((_, i) => this.listeners.notify(i, `turn_${this.currentPlayerIndex === i ? "me" : "op"}`));

        const player = this.players[this.currentPlayerIndex];

        const canPlay = (player.cards.hand.length > 0 || player.isLeaderAvailable) && !player.hasPassed;
        if (!canPlay) {
            player.hasPassed = true;
        }
    }

    private async endRound(): Promise<void> {
        const scores = this.players.map((_, i) => this.board.getPlayerScore(i));
        const [firstScore, secondScore] = scores;

        let winner: PlayerIndex|null = firstScore > secondScore ? 0 : 1;
        if (firstScore === secondScore) {
            winner = null;
        }

        this.roundResults.push({
            winner,
            scores,
        });

        this.players.filter((_, i) => i !== winner)
            .forEach((player) => --player.gems);

        this.onRoundEnd = await Game.runEffects(this.onRoundEnd);

        this.players.forEach((player, i) => {
            Object.entries(this.board.getPlayerBoard(i))
                .forEach(([rowName, row]) => {
                    const toDiscard = [
                        ...row.getUnits(),
                        ...row.getSpecial(),
                        ...this.board.getPlayerWeather(i),
                    ];

                    toDiscard.forEach((c) => this.removeCard(c, i, rowName as UnitRow));

                    player.cards.discard(...toDiscard);
                });

            const result = winner === null ?
                "draw" :
                winner === i ?
                    "win" :
                    "lose";
            this.listeners.notify(i, `${result}_round`);
        });

        this.board.clear();
    }

    private async removeCard(card: CardData, playerIndex: PlayerIndex, row: UnitRow): Promise<void> {
        card.abilities.forEach((ability) => abilities[ability]?.onRemoved?.(this, playerIndex, row, card));
    }

    private async executePlay(play: Play): Promise<boolean> {
        if (this.players[this.currentPlayerIndex].hasPassed) {
            throw new Error("cannot execute play on a player who passed");
        }

        switch (play.type) {
        case "pass":
            this.players[this.currentPlayerIndex].hasPassed = true;
            this.players.forEach((_, i) => this.listeners.notify(i, `pass_${this.currentPlayerIndex === i ? "me" : "op"}`));

            return true;
        case "leader": {
            const {leader, isLeaderAvailable} = this.players[this.currentPlayerIndex];
            if (!isLeaderAvailable) {
                return false;
            }

            const ok = this.playCard(leader, this.currentPlayerIndex);
            if (!ok) {
                return false;
            }

            this.players[this.currentPlayerIndex].isLeaderAvailable = false;

            return true;
        }
        case "card": {
            const card = this.players[this.currentPlayerIndex].cards.hand.find(({filename}) => filename === play.card);
            if (!card) {
                return false;
            }

            return this.playCard(card, this.currentPlayerIndex, play.row);
        }
        }
    }

    async playCard(card: CardData, playerIndex: PlayerIndex, row?: UnitRow) : Promise<boolean> {
        switch (card.type) {
        case "weather":
            // TODO
            this.players[playerIndex].cards.play(card);

            this.board.playWeather(card, playerIndex);

            await this.placeCard(card, playerIndex, null);

            return true;
        case "special": {
            // TODO
            if (!row) {
                return false;
            }

            this.players[playerIndex].cards.play(card);

            this.board.playSpecial(card, playerIndex, row);

            await this.placeCard(card, playerIndex, row);

            return true;
        }
        case "unit": {
            // TODO
            const r = row ?? (card.abilities.includes("agile") ? "close" : card.rows[0]);

            const playerRow = card.abilities.includes("spy") ?
                this.getOpponentIndex(playerIndex) :
                playerIndex;

            const ok = this.board.playUnit(card, playerRow, r);
            if (!ok) {
                return false;
            }

            this.players[playerIndex].cards.play(card);

            await this.placeCard(card, playerIndex, r);

            return true;
        }
        case "leader":
            await this.placeCard(card, playerIndex, null);

            return true;
        }
    }

    private async placeCard(card: CardData, playerIndex: PlayerIndex, row: UnitRow|null): Promise<void> {
        await Promise.all(card.abilities.map(async (ability) => {
            await abilities[ability]?.onPlaced?.(this, playerIndex, row, card);
        }));
    }
}
