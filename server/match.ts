import Game from "./game";
import Listeners from "./listeners";
import type {PlayerIndex, RoundResult} from "./types/game";
import type {CardData} from "../shared/types/card";
import type {NotificationName} from "../shared/types/notification";
import type {ServerSideSocket} from "../shared/types/socket";
import type {Play, State} from "../shared/types/game";
import type {PlayerIndicator} from "../shared/types/player";
import type {Deck} from "../shared/types/deck";


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
        return new Promise<CardData[]>((resolve) => this.sockets[playerIndex].emit("select_cards", cards, amount, isClosable, resolve));
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
