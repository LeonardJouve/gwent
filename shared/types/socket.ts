import type {Socket as ServerSocket} from "socket.io";
import type {Socket as ClientSocket} from "socket.io-client";

export type ClientToServerEvents = {

};

export type ServerToClientEvents = {

};

export type SocketData = {

};

export type ServerSideClientSocket = ServerSocket<ClientToServerEvents, ServerToClientEvents, never, SocketData>;
export type ClientSideClientSocket = ClientSocket<ServerToClientEvents, ClientToServerEvents>;
