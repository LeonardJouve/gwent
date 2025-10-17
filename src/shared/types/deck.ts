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

export const SerializedDeckSchema = z.object({
    leader: z.string().describe("leader filename"),
    cards: z.record(z.string().describe("card filename"), z.number().describe("card amount")),
});

export type SerializedDeck = z.infer<typeof SerializedDeckSchema>;
