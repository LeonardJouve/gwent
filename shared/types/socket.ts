import type {Socket as ServerSocket} from "socket.io";
import type {Socket as ClientSocket} from "socket.io-client";
import {z} from "zod/v4";
import type {RoundResult} from "./game.js";
import type {CardData} from "./card.js";
import type {NotificationName} from "./notification.js";
import type {Play, State} from "./game.js";
import type {PlayerIndicator} from "./player.js";

export type ClientToServerEvents = never;

export type ServerToClientEvents = {
    get_data: (callback: (data: SocketData) => void) => void;
    ask_start: (callback: (player: PlayerIndicator) => void) => void;
    ask_play: (callback: (play: Play) => void) => void;
    select_cards: (cards: CardData[], amount: number, isClosable: boolean, callback: (cards: CardData["filename"][]) => void) => void;
    notify: (name: NotificationName) => void;
    show_cards: (cards: CardData[], callback: () => void) => void;
    show_results: (results: RoundResult[], winner: PlayerIndicator|null) => void;
    send_state: (state: State) => void;
};

export const SocketDataSchema = z.object({
    id: z.string(),
    matchId: z.string(),
});

export type SocketData = z.infer<typeof SocketDataSchema>;

export type ServerSideSocket = ServerSocket<ClientToServerEvents, ServerToClientEvents, never, SocketData>;
export type ClientSideSocket = ClientSocket<ServerToClientEvents, ClientToServerEvents>;
