import type {ServerSideSocket} from "../shared/types/socket";

export const matches: Record<string, Match> = {};

export default class Match {
    public id: string;
    private playerIds: string[];
    private sockets: ServerSideSocket[];

    constructor(playerIds: string[]) {
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
        // TODO
    }

    private remove(): void {
        Reflect.deleteProperty(matches, this.id);
    }
}
