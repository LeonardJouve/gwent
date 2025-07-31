import {Server as SocketIOServer} from "socket.io";
import type {ClientToServerEvents, ServerToClientEvents, SocketData} from "../shared/types/socket";
import type {Server} from "node:http";
import type {Http2SecureServer, Http2Server} from "node:http2";

export const initSocketIO = (server: Server | Http2Server | Http2SecureServer): void => {
    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, never, SocketData>(server);

    io.on("connection", (_socket) => {
        // TODO
    });
};
