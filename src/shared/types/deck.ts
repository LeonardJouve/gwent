import {z} from "zod/v4";
import {CardDataSchema, LeaderCardSchema, SerializedCardSchema} from "./card.js";

export const DeckSchema = z.object({
    leader: LeaderCardSchema,
    cards: z.array(CardDataSchema),
});

export type Deck = z.infer<typeof DeckSchema>;

export const SerializedDeckSchema = z.object({
    leader: z.string().describe("leader filename"),
    cards: z.record(SerializedCardSchema, z.number().describe("card amount")),
});

export type SerializedDeck = z.infer<typeof SerializedDeckSchema>;
