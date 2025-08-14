import {io} from "socket.io-client";
import type {SocketData, ClientSideSocket} from "@shared/types/socket";
import {PUBLIC_SOCKET_SERVER_URL} from "$env/static/public";

export class SocketHandler {
    private socketData: SocketData;
    private socket: ClientSideSocket;

    constructor(socketData: SocketData) {
        this.socketData = socketData;
        this.socket = io(PUBLIC_SOCKET_SERVER_URL);

        this.handle();
    }

    handle(): void {
        this.socket.on("get_data", this.handleGetData.bind(this));
    }

    handleGetData(callback: (data: SocketData) => void): void {
        callback(this.socketData);
    }
}
