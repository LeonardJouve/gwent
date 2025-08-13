import {z} from "zod/v4";
import {AbilityIdSchema} from "./ability";
import {FactionNameSchema} from "./faction";

export const UnitRowSchema = z.enum(["close", "ranged", "siege"]);

export const CardDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    deck: z.union([
        FactionNameSchema,
        z.enum(["neutral", "special", "weather"])
    ]),
    row: z.union([UnitRowSchema, z.literal("agile")]).optional(),
    strength: z.number(),
    abilities: z.array(AbilityIdSchema),
    filename: z.string(),
    maxPerDeck: z.number(),
})

export type CardData = z.infer<typeof CardDataSchema>

export type UnitRow = z.infer<typeof UnitRowSchema>;
