import {Server as SocketIOServer} from "socket.io";
import type {ServerType} from "@hono/node-server";
import type {ClientToServerEvents, ServerToClientEvents, SocketData} from "../shared/types/socket";
import Match from "./match";

export const initSocketIO = (server: ServerType): void => {
    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, never, SocketData>(server, {
        cors: {
            origin: "http://localhost:5173",
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
