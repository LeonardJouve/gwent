import type {SocketData, ClientSideSocket} from "@shared/types/socket";

export class SocketHandler {
    private socketData: SocketData;
    private socket: ClientSideSocket;

    constructor(socketData: SocketData, socket: ClientSideSocket) {
        this.socketData = socketData;
        this.socket = socket;

        this.handle();
    }

    handle(): void {
        this.socket.on("get_data", this.handleGetData.bind(this));
    }

    handleGetData(callback: (data: SocketData) => void): void {
        callback(this.socketData);
    }
}
