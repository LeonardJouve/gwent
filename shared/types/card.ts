import {z} from "zod/v4";
import {AbilityIdSchema} from "./ability.js";
import {FactionNameSchema} from "./faction.js";

export const UnitRowSchema = z.enum(["close", "ranged", "siege"]);

export const BaseCardDataSchema = z.object({
    name: z.string(),
    faction: FactionNameSchema.or(z.literal("neutral")),
    abilities: z.array(AbilityIdSchema),
    filename: z.string(),
    maxPerDeck: z.number(),
});

export const WeatherCardSchema = BaseCardDataSchema.and(z.object({
    type: z.literal("weather"),
}));

export const SpecialCardSchema = BaseCardDataSchema.and(z.object({
    type: z.literal("special"),
}));

export const LeaderCardSchema = BaseCardDataSchema.and(z.object({
    type: z.literal("leader"),
}));

export const UnitCardSchema = BaseCardDataSchema.and(z.object({
    type: z.literal("unit"),
    rows: z.array(UnitRowSchema),
    strength: z.number(),
}));

export const CardDataSchema = WeatherCardSchema
    .or(SpecialCardSchema)
    .or(UnitCardSchema)
    .or(LeaderCardSchema);

export type UnitRow = z.infer<typeof UnitRowSchema>;

export type CardData = z.infer<typeof CardDataSchema>;


export type WeatherCardData = z.infer<typeof WeatherCardSchema>;

export type SpecialCardData = z.infer<typeof SpecialCardSchema>;

export type LeaderCardData = z.infer<typeof LeaderCardSchema>;

export type UnitCardData = z.infer<typeof UnitCardSchema>;
