import type {CardData} from "@shared/types/card";

// TODO remove and rework deck attribute
const getFaction = (card: CardData): string => card.deck === "special" || card.deck === "weather" ? "neutral" : card.deck;

export const imgURL = (file: string, ext: string, prefix?: string): string => `assets/img/${prefix ? `${prefix}/` : ""}${file}.${ext}`;

export const iconURL = (file: string, ext = "png"): string => imgURL(file, ext, "icons");

export const largeURL = (card: CardData, ext = "jpg"): string => imgURL(`${getFaction(card)}/${card.filename}`, ext, "lg");

export const getClass = (prefix: string, card: CardData): string => `${prefix}-${getFaction(card)}-${card.filename.replaceAll("_", "-")}`;

export const largeClass = (card: CardData): string => getClass("lg", card);

export const smallClass = (card: CardData): string => getClass("sm", card);
