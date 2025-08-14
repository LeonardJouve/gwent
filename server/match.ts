import Game from "./game";
import Listeners from "./listeners";
import type {PlayerIndex, RoundResult} from "./types/game";
import type {CardData} from "../shared/types/card";
import type {NotificationName} from "../shared/types/notification";
import type {ServerSideSocket} from "../shared/types/socket";
import type {Play, State} from "../shared/types/game";

export const matches: Record<string, Match> = {};

export default class Match extends Listeners {
    public id: string;
    private playerIds: string[];
    private sockets: ServerSideSocket[];

    constructor(playerIds: string[]) {
        super();

        if (playerIds.length !== 2) {
            throw new Error("invalid playerIds amount");
        }
        this.id = crypto.randomUUID();
        this.playerIds = playerIds;
        this.sockets = [];
    }

    join(socket: ServerSideSocket): void {
        if (!this.playerIds.includes(socket.data.id) || this.sockets.find(({data}) => data.id === socket.data.id)) {
            return;
        }

        this.sockets.push(socket);

        this.tryStartMatch();
    }

    private tryStartMatch(): void {
        if (this.sockets.length !== 2) {
            return;
        }

        const game = new Game(this, this.sockets.map(({data}) => data));
        game.playGame();
    }

    private remove(): void {
        Reflect.deleteProperty(matches, this.id);
    }

    askStart(playerIndex: PlayerIndex): Promise<PlayerIndex> {
        return new Promise<PlayerIndex>((resolve) => this.sockets[playerIndex].emit("ask_start", resolve));
    }

    selectCards(playerIndex: PlayerIndex, cards: CardData[], amount: number): Promise<CardData[]> {
        return new Promise<CardData[]>((resolve) => this.sockets[playerIndex].emit("select_cards", cards, amount, resolve));
    }

    showCards(playerIndex: PlayerIndex, cards: CardData[]): Promise<void> {
        return new Promise<void>((resolve) => this.sockets[playerIndex].emit("show_cards", cards, resolve));
    }

    notify(playerIndex: PlayerIndex, name: NotificationName): void {
        this.sockets[playerIndex].emit("notify", name);
    }

    showResults(playerIndex: PlayerIndex, results: RoundResult[]): void {
        this.sockets[playerIndex].emit("show_results", results);

        this.remove();
    }

    askPlay(playerIndex: PlayerIndex): Promise<Play> {
        return new Promise<Play>((resolve) => this.sockets[playerIndex].emit("ask_play", resolve));
    }

    sendState(playerIndex: PlayerIndex, state: State): void {
        this.sockets[playerIndex].emit("send_state", state);
    }
}
