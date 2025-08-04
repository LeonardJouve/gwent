import type {CardData} from "../shared/types/card";
import type {NotificationName} from "../shared/types/notification";
import type {PlayerIndex, RoundResult} from "./types/game";

type Play = {
    type: "pass"|"leader";
    card: undefined;
} | {
    type: "card";
    card: CardData;
};

export default abstract class Listeners {
    abstract askStart(playerIndex: PlayerIndex): Promise<PlayerIndex>;
    abstract askSelect(playerIndex: PlayerIndex, cards: CardData[], amount: number): Promise<CardData[]>;
    abstract showCards(playerIndex: PlayerIndex, cards: CardData[]): Promise<void>;
    abstract notify(playerIndex: PlayerIndex, name: NotificationName): void;
    abstract showResults(playerIndex: PlayerIndex, results: RoundResult[]): void;
    abstract askPlay(playerIndex: PlayerIndex): Promise<Play>;
}
