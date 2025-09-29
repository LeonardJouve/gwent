import {z} from "zod/v4";
import {AbilityIdSchema} from "./ability";
import {FactionNameSchema} from "./faction";

export const UnitRowSchema = z.enum(["close", "ranged", "siege"]);

export const CardDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    faction: FactionNameSchema.or(z.literal("neutral")),
    type: z.enum(["weather", "special", "unit", "leader"]),
    row: z.union([UnitRowSchema, z.literal("agile")]).optional(),
    strength: z.number(),
    abilities: z.array(AbilityIdSchema),
    filename: z.string(),
    maxPerDeck: z.number(),
});

export type CardData = z.infer<typeof CardDataSchema>;

export type UnitRow = z.infer<typeof UnitRowSchema>;
