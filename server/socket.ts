import {Server as SocketIOServer} from "socket.io";
import type {ClientToServerEvents, ServerToClientEvents, SocketData} from "../shared/types/socket";
import type {Server} from "node:http";
import type {Http2SecureServer, Http2Server} from "node:http2";
import {matches} from "./match";

export const initSocketIO = (server: Server | Http2Server | Http2SecureServer): void => {
    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, never, SocketData>(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.emit("get_data", (data) => {
            if (!(data.matchId in matches)) {
                socket.disconnect();
                return;
            }

            socket.data = {...data};

            matches[socket.data.matchId].join(socket);
        });
    });
};
