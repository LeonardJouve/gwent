export type CardData = {
    name: string;
    id: string;
    deck: string;
    row: UnitRow | "agile" | "leader" | "";
    strength: string;
    ability: string;
    filename: string;
    count: string;
};

export type UnitRow = "close" | "ranged" | "siege";
