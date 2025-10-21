import z from "zod/v4";
import {FactionNameSchema} from "./faction.js";
import {DeckSchema, SerializedDeckSchema} from "./deck.js";

export const MatchmakeSchema = z.object({
    name: z.string(),
    faction: FactionNameSchema,
    deck: DeckSchema,
});

export type Matchmake = z.infer<typeof MatchmakeSchema>;

export const SerializedMatchmakeSchema = z.object({
    name: z.string(),
    faction: FactionNameSchema,
    deck: SerializedDeckSchema,
});

export type SerializedMatchmake = z.infer<typeof SerializedMatchmakeSchema>;
