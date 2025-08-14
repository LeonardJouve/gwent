import {z} from "zod/v4";
import {CardDataSchema} from "./card";
import {FactionNameSchema} from "./faction";

export const DeckSchema = z.object({
    name: z.string(),
    faction: FactionNameSchema,
    leader: CardDataSchema,
    deck: z.array(CardDataSchema),
});

export type Deck = z.infer<typeof DeckSchema>;
