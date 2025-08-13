import type {CardData} from "../shared/types/card";
import type {NotificationName} from "../shared/types/notification";
import type {Play, State} from "../shared/types/game";
import type {PlayerIndex, RoundResult} from "./types/game";

export default abstract class Listeners {
    abstract askStart(playerIndex: PlayerIndex): Promise<PlayerIndex>;
    abstract selectCards(playerIndex: PlayerIndex, cards: CardData[], amount: number): Promise<CardData[]>;
    abstract showCards(playerIndex: PlayerIndex, cards: CardData[]): Promise<void>;
    abstract notify(playerIndex: PlayerIndex, name: NotificationName): void;
    abstract showResults(playerIndex: PlayerIndex, results: RoundResult[]): void;
    abstract askPlay(playerIndex: PlayerIndex): Promise<Play>;
    abstract sendState(playerIndex: PlayerIndex, state: State): void;
}
