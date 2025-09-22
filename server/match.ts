import Game from "./game";
import Listeners from "./listeners";
import type {PlayerIndex, RoundResult} from "./types/game";
import type {CardData} from "../shared/types/card";
import type {NotificationName} from "../shared/types/notification";
import type {ServerSideSocket} from "../shared/types/socket";
import type {Play, State} from "../shared/types/game";
import type {PlayerIndicator} from "../shared/types/player";

export const matches: Record<string, Match> = {};

export default class Match extends Listeners {
    public id: string;
    private playerIds: string[];
    private sockets: ServerSideSocket[];
    private game?: Game;

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

        this.game = new Game(this, this.sockets.map(({data}) => data));
        this.game.playGame();
    }

    private remove(): void {
        Reflect.deleteProperty(matches, this.id);
    }

    async askStart(playerIndex: PlayerIndex): Promise<PlayerIndex> {
        if (!this.game) {
            throw new Error("game is not defined");
        }

        const player = await new Promise<PlayerIndicator>((resolve) => this.sockets[playerIndex].emit("ask_start", resolve));
        return player === "me" ? playerIndex : this.game.getOpponentIndex(playerIndex);
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
