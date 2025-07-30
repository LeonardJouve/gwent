import Cards from "$lib/server/cards";
import Board from "$lib/server/board";
import type {Player, Options, PlayerIndex, RoundResult, Effect, PlayerData} from "$lib/server/types/game";
import type {CardData, UnitRow} from "$lib/types/card";
import abilities from "$lib/server/abilities";
import factions from "$lib/server/factions";

export default class Game {
    private options: Options;
    public players: Player[];
    public currentPlayerIndex: PlayerIndex;
    private roundResults: RoundResult[];
    public onGameStart: Effect[];
    public onRoundStart: Effect[];
    public onRoundEnd: Effect[];
    public board: Board;

    constructor(players: PlayerData[]) {
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
        this.players = players.map(({deck, ...player}) => ({
            ...player,
            cards: new Cards(deck),
            isLeaderAvailable: true,
            gems: 2,
            hasPassed: false,
        }));
    }

    private static tossCoin(): PlayerIndex {
        return Math.round(Math.random());
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

    getPlayer(playerIndex: PlayerIndex): Player {
        return this.players[playerIndex];
    }

    getPlayerCards(playerIndex: PlayerIndex): Cards {
        return this.players[playerIndex].cards;
    }

    getOptions(): Options {
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
            .filter((_, i) => !playerIndex || i === playerIndex)
            .map((_, i) => this.board.getPlayerBoard(i))
            .flatMap((playerBoard, i) => Object.entries(playerBoard)
                .filter(([name]) => !rowName || rowName === name)
                .map(([_, row]) => ({
                    row,
                    i,
                })));

        const maxScore = Math.max(...rows.flatMap(({row}) => row
            .getUnits()
            .map((card) => row.getCardScore(card))));

        rows.forEach(({row, i}) => row.remove(...row
            .getUnits()
            .filter((card) => {
                if (row.getCardScore(card) !== maxScore) {
                    return false;
                }

                this.players[i].cards.discard(card);
                return true;
            })));
    }

    private static runEffects(effects: Effect[]): Effect[] {
        return effects.filter(({run, once}) => {
            run();
            return !once;
        });
    }

    playGame(): void {
        this.startGame();

        while (this.players.some(({gems}) => !gems)) {
            this.startRound();

            while (!this.players.every(({hasPassed}) => hasPassed)) {
                this.startTurn();

                // TODO: pass / play card / activate leader

                this.currentPlayerIndex = this.getOpponentIndex(this.currentPlayerIndex);
            }

            this.endRound();
        }
    }

    private startGame(): void {
        this.players.forEach((player, i) => {
            player.cards.deck = Cards.shuffle(player.cards.deck);

            player.leader.abilities.forEach((ability) => {
                abilities[ability]?.onGameStart?.(this, i);
            });

            factions[player.faction](this, i);

            player.cards.draw(10);
        });

        this.onGameStart = Game.runEffects(this.onGameStart);

        if (!this.currentPlayerIndex) {
            this.currentPlayerIndex = Game.tossCoin();
        }

        this.players.forEach(async (player) => {
            for (let i = 0; i < 2; ++i) {
                const [card] = await this.askSelect(player.cards.hand, i);
                player.cards.redraw(card);
            }
        });
    }

    private startRound(): void {
        this.players.forEach((player) => player.hasPassed = false);

        const lastRoundResult = this.getLastRoundResult();
        if (lastRoundResult) {
            this.currentPlayerIndex = lastRoundResult.winner ?? Game.tossCoin();
        }

        this.onRoundStart = Game.runEffects(this.onRoundStart);
    }

    private startTurn(): void {
        const player = this.players[this.currentPlayerIndex];

        const canPlay = (player.cards.hand.length > 0 || player.isLeaderAvailable) && !player.hasPassed;
        if (!canPlay) {
            player.hasPassed = true;
        }
    }

    private endRound(): void {
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

        this.onRoundEnd = Game.runEffects(this.onRoundEnd);

        this.board.clear();
    }

    async askStart(): Promise<PlayerIndex> {
        // TODO
        return await new Promise<PlayerIndex>((resolve) => resolve(0));
    }

    async askSelect(cards: CardData[], playerIndex: PlayerIndex, amount = 1): Promise<CardData[]> {
        // TODO
        return await new Promise<CardData[]>((resolve) => resolve(cards.slice(0, amount)));
    }

    async showCards(cards: CardData[]): Promise<void> {
        // TODO
        return await new Promise<void>((resolve) => resolve());
    }
}
