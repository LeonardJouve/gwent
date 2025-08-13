import type {Socket as ServerSocket} from "socket.io";
import type {Socket as ClientSocket} from "socket.io-client";
import type {Deck} from "./deck";
import type {PlayerIndex, RoundResult} from "../../server/types/game";
import type {CardData} from "./card";
import type {NotificationName} from "./notification";
import type {Play, State} from "./game";

export type ClientToServerEvents = never;

export type ServerToClientEvents = {
    get_data: (callback: (data: SocketData) => void) => void;
    ask_start: (callback: (playerIndex: PlayerIndex) => void) => void;
    ask_play: (callback: (play: Play) => void) => void;
    select_cards: (cards: CardData[], amount: number, callback: (cards: CardData[]) => void) => void;
    notify: (name: NotificationName) => void;
    show_cards: (cards: CardData[], callback: () => void) => void;
    show_results: (results: RoundResult[]) => void;
    send_state: (state: State) => void;
};

export type SocketData = Deck & {
    id: string;
    matchId: string;
};

export type ServerSideSocket = ServerSocket<ClientToServerEvents, ServerToClientEvents, never, SocketData>;
export type ClientSideSocket = ClientSocket<ServerToClientEvents, ClientToServerEvents>;
