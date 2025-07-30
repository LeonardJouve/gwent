import Cards from "$lib/server/cards";
import Board from "$lib/server/board";
import type {Player, Options, PlayerIndex, RoundResult, Effect, PlayerData} from "./types/game";
import type {CardData} from "$lib/types/card";

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

    askStart(callback: (playerIndex: PlayerIndex) => void): void {
        callback(0);
        // TODO
    }

    askSelect(cards: CardData[], playerIndex: PlayerIndex, callback: (cards: CardData[]) => void, amount = 1): void {
        // TODO
    }

    showCards(cards: CardData[], resolve: () => void): void {
        // TODO
    }
}
