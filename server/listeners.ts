import type {CardData} from "../shared/types/card.js";
import type {NotificationName} from "../shared/types/notification.js";
import type {Play, State} from "../shared/types/game.js";
import type {PlayerIndex, RoundResult} from "./types/game.js";

export default abstract class Listeners {
    abstract askStart(playerIndex: PlayerIndex): Promise<PlayerIndex>;
    abstract selectCards(playerIndex: PlayerIndex, cards: CardData[], amount: number, isClosable: boolean): Promise<CardData[]>;
    abstract showCards(playerIndex: PlayerIndex, cards: CardData[]): Promise<void>;
    abstract notify(playerIndex: PlayerIndex, name: NotificationName): void;
    abstract showResults(playerIndex: PlayerIndex, results: RoundResult[], winner: PlayerIndex|null): void;
    abstract askPlay(playerIndex: PlayerIndex): Promise<Play>;
    abstract sendState(playerIndex: PlayerIndex, state: State): void;
}
