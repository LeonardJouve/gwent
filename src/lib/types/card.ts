import type {AbilityId} from "$lib/types/ability";
import type {FactionName} from "$lib/types/faction";

export type CardData = {
    name: string;
    id: string;
    deck: FactionName | "neutral" | "special" | "weather";
    row?: UnitRow | "agile";
    strength: number;
    abilities: AbilityId[];
    filename: string;
    maxPerDeck: number;
};

export type UnitRow = "close" | "ranged" | "siege";
