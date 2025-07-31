export type Faction = {
    id: FactionName;
    name: string;
    description: string;
};

export type FactionName = "realms" | "nilfgaard" | "monsters" | "scoiatael" | "skellige";
