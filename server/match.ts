import Game from "./game.js";
import Listeners from "./listeners.js";
import type {PlayerIndex, RoundResult} from "./types/game.js";
import type {CardData} from "../shared/types/card.js";
import type {NotificationName} from "../shared/types/notification.js";
import type {ServerSideSocket} from "../shared/types/socket.js";
import type {Play, State} from "../shared/types/game.js";
import type {PlayerIndicator} from "../shared/types/player.js";
import type {Deck} from "../shared/types/deck.js";
import type {RoundResult as SocketRoundResult} from "../shared/types/game.js";

export default class Match extends Listeners {
    static matches = new Map<string, Match>();
    public id: string;
    private playerIds: string[];
    private sockets: ServerSideSocket[];
    private game: Game;

    constructor(playerDatas: (Deck & {id: string})[]) {
        super();

        if (playerDatas.length !== 2) {
            throw new Error("invalid player data amount");
        }

        this.game = new Game(this, playerDatas);
        this.playerIds = playerDatas.map(({id}) => id);
        this.id = crypto.randomUUID();
        this.sockets = [];
    }

    join(socket: ServerSideSocket): boolean {
        if (!this.playerIds.includes(socket.data.id) || this.sockets.some(({data}) => data.id === socket.data.id)) {
            return false;
        }

        this.sockets.push(socket);

        this.tryStartMatch();

        return true;
    }

    private async tryStartMatch(): Promise<void> {
        if (this.sockets.length !== 2) {
            return;
        }

        await this.game.playGame();
    }

    private remove(): void {
        Match.matches.delete(this.id);
    }

    async askStart(playerIndex: PlayerIndex): Promise<PlayerIndex> {
        const player = await new Promise<PlayerIndicator>((resolve) => this.sockets[playerIndex].emit("ask_start", resolve));
        return player === "me" ? playerIndex : this.game.getOpponentIndex(playerIndex);
    }

    selectCards(playerIndex: PlayerIndex, cards: CardData[], amount: number, isClosable: boolean): Promise<CardData[]> {
        // TODO use filename and verify selected card is valid
        return new Promise<CardData[]>((resolve) => this.sockets[playerIndex].emit("select_cards", cards, amount, isClosable, resolve));
    }

    showCards(playerIndex: PlayerIndex, cards: CardData[]): Promise<void> {
        return new Promise<void>((resolve) => this.sockets[playerIndex].emit("show_cards", cards, resolve));
    }

    notify(playerIndex: PlayerIndex, name: NotificationName): void {
        this.sockets[playerIndex].emit("notify", name);
    }

    showResults(playerIndex: PlayerIndex, results: RoundResult[], winner: PlayerIndex|null): void {
        const winnerIndicator = winner === null ?
            null :
            winner === playerIndex ?
                "me" :
                "opponent";
        const socketResults = results.map<SocketRoundResult>((result) => ({
            winner: result.winner === playerIndex ? "me" : "opponent",
            scores: result.scores.reduce((acc, score, i) => {
                if (playerIndex === i) {
                    acc["me"] = score;
                } else {
                    acc["opponent"] = score;
                }

                return acc;
            }, {
                me: 0,
                opponent: 0,
            }),
        }));
        this.sockets[playerIndex].emit("show_results", socketResults, winnerIndicator);

        this.remove();
    }

    askPlay(playerIndex: PlayerIndex): Promise<Play> {
        return new Promise<Play>((resolve) => this.sockets[playerIndex].emit("ask_play", resolve));
    }

    sendState(playerIndex: PlayerIndex, state: State): void {
        this.sockets[playerIndex].emit("send_state", state);
    }
}
