import {z} from "zod/v4";
import {CardDataSchema, type CardData} from "./card";
import {FactionNameSchema, type FactionName} from "./faction";

export type Deck = {
    name: string;
    faction: FactionName;
    leader: CardData;
    deck: CardData[];
};

export const DeckSchema = z.object({
    name: z.string(),
    faction: FactionNameSchema,
    leader: CardDataSchema,
    deck: z.array(CardDataSchema),
});
