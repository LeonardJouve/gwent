import type {FactionName} from "./faction";

export type PremadeDeck = {
    faction: FactionName;
    leader: number;
    cards: [number, number][];
};
