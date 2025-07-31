import type {AbilityId} from "./ability";
import type {FactionName} from "./faction";

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
