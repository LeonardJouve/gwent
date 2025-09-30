import {z} from "zod/v4";
import {AbilityIdSchema} from "./ability";
import {FactionNameSchema} from "./faction";

export const UnitRowSchema = z.enum(["close", "ranged", "siege"]);

const WeatherCardSchema = z.object({
    type: z.literal("weather"),
    rows: z.tuple([z.literal("weather")]),
});

const SpecialCardSchema = z.object({
    type: z.literal("special"),
    rows: z.tuple([z.literal("special")]),
});

const LeaderCardSchema = z.object({
    type: z.literal("leader"),
    rows: z.tuple([z.literal("leader")]),
});

const UnitCardSchema = z.object({
    type: z.literal("unit"),
    rows: z.array(UnitRowSchema),
    strength: z.number(),
});

const BaseCardDataSchema = z.object({
    name: z.string(),
    faction: FactionNameSchema.or(z.literal("neutral")),
    abilities: z.array(AbilityIdSchema),
    filename: z.string(),
    maxPerDeck: z.number(),
});

export const CardDataSchema = BaseCardDataSchema.and(WeatherCardSchema
    .or(SpecialCardSchema)
    .or(UnitCardSchema)
    .or(LeaderCardSchema));

export type CardData = z.infer<typeof CardDataSchema>;

export type UnitRow = z.infer<typeof UnitRowSchema>;
