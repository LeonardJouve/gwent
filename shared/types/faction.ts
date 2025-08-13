import {z} from "zod/v4";

export type Faction = {
    id: FactionName;
    name: string;
    description: string;
};

export const FactionNameSchema = z.enum([
    "realms",
    "nilfgaard",
    "monsters",
    "scoiatael",
    "skellige",
]);

export type FactionName = z.infer<typeof FactionNameSchema>;
