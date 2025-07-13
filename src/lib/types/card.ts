export type CardData = {
    name: string;
    id: string;
    deck: string;
    row: UnitRow | "agile" | "leader" | "";
    strength: number;
    abilities: string[];
    filename: string;
    count: number;
};

export type UnitRow = "close" | "ranged" | "siege";
