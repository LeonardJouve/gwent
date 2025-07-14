import type {FactionName} from "$lib/types/faction";

export type PremadeDeck = {
    faction: FactionName;
    leader: number;
    cards: [number, number][];
};
