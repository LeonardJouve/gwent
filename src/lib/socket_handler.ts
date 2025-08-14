import {io} from "socket.io-client";
import type {SocketData, ClientSideSocket} from "@shared/types/socket";
import {PUBLIC_SOCKET_SERVER_URL} from "$env/static/public";
import type {State} from "@shared/types/game";
import {store} from "./store/game.svelte";

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
        this.socket.on("send_state", SocketHandler.handleSendState);
    }

    handleGetData(callback: (data: SocketData) => void): void {
        callback(this.socketData);
    }

    static handleSendState({turn, players, board}: State): void {
        store.turn = turn;
        store.players = {...players};
        store.board = board;
    }
}
