import type {CardData} from "@shared/types/card.js";
import type {NotificationName} from "@shared/types/notification.js";
import type {Play, State} from "@shared/types/game.js";
import type {PlayerId, RoundResult} from "./types/game.js";
import type {CardSelection} from "@shared/types/socket.js";

export default interface Listeners {
    askStart(playerId: PlayerId): Promise<PlayerId>;
    selectCard(playerId: PlayerId, cards: CardData[], isClosable: boolean, startIndex?: number): Promise<CardSelection|null>;
    showCards(playerId: PlayerId, cards: CardData[]): Promise<void>;
    notify(playerId: PlayerId, name: NotificationName): void;
    showResults(playerId: PlayerId, results: RoundResult[], winner: PlayerId|null): void;
    askPlay(playerId: PlayerId): Promise<Play>;
    sendState(playerId: PlayerId, state: State): void;
}
