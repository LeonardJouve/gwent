import {z} from "zod/v4";
import {CardDataSchema, LeaderCardSchema} from "./card.js";
import {FactionNameSchema} from "./faction.js";

export const DeckSchema = z.object({
    name: z.string(),
    faction: FactionNameSchema,
    leader: LeaderCardSchema,
    deck: z.array(CardDataSchema),
});

export type Deck = z.infer<typeof DeckSchema>;
