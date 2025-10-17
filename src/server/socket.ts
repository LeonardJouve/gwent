import {Server as SocketIOServer} from "socket.io";
import type {ServerType} from "@hono/node-server";
import type {ClientToServerEvents, ServerToClientEvents, SocketData} from "@shared/types/socket.js";
import Match from "./match.js";

export const initSocketIO = (server: ServerType, clientURL: string): void => {
    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, never, SocketData>(server, {
        cors: {
            origin: clientURL,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.emit("get_data", (data) => {
            const match = Match.matches.get(data.matchId);
            if (!match) {
                socket.disconnect();
                return;
            }

            socket.data = {...data};

            const ok = match.join(socket);
            if (!ok) {
                socket.disconnect();
            }
        });
    });
};
