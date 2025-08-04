import type {CardData} from "./card";
import type {FactionName} from "./faction";

export type Deck = {
    name: string;
    faction: FactionName;
    leader: CardData;
    deck: CardData[];
};
