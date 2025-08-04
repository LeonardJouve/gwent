import Game from "./game";
import Listeners from "./listeners";
import type {PlayerIndex, RoundResult} from "./types/game";
import type {CardData} from "../shared/types/card";
import type {NotificationName} from "../shared/types/notification";
import type {ServerSideSocket} from "../shared/types/socket";

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
    }

    join(socket: ServerSideSocket): void {
        if (!this.playerIds.includes(socket.data.id) || this.sockets.find(({data}) => data.id === socket.data.id)) {
            return;
        }

        this.sockets.push(socket);

        this.tryStartMatch();
    }

    private tryStartMatch(): void {
        // TODO new Game();
        const game = new Game(this, this.sockets.map(({data}) => data));
        game.playGame();
    }

    private remove(): void {
        Reflect.deleteProperty(matches, this.id);
    }

    askStart(playerIndex: PlayerIndex): Promise<PlayerIndex> {
        // TODO
    }

    askSelect(playerIndex: PlayerIndex, cards: CardData[], amount: number): Promise<CardData[]> {
        // TODO
    }

    showCards(playerIndex: PlayerIndex, cards: CardData[]): Promise<void> {
        // TODO
    }

    notify(playerIndex: PlayerIndex, name: NotificationName): void {
        // TODO
    }

    showResults(playerIndex: PlayerIndex, results: RoundResult[]): void {
        // TODO
    }

    askPlay(playerIndex: PlayerIndex): Promise<{ type: "pass" | "leader"; card: undefined; } | { type: "card"; card: CardData; }> {
        // TODO
    }
}
