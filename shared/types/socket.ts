import type {Socket as ServerSocket} from "socket.io";
import type {Socket as ClientSocket} from "socket.io-client";
import type {Deck} from "./deck";

export type ClientToServerEvents = never;

export type ServerToClientEvents = {
    get_data: (callback: (data: SocketData) => void) => void;
};

export type SocketData = Deck & {
    id: string;
    matchId: string;
};

export type ServerSideSocket = ServerSocket<ClientToServerEvents, ServerToClientEvents, never, SocketData>;
export type ClientSideSocket = ClientSocket<ServerToClientEvents, ClientToServerEvents>;
