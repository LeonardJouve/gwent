import type {CardData} from "@shared/types/card";

export const imgURL = (file: string, ext: string, prefix?: string): string => `assets/img/${prefix ? `${prefix}/` : ""}${file}.${ext}`;

export const iconURL = (file: string, ext = "png"): string => imgURL(file, ext, "icons");

export const largeURL = (card: CardData, ext = "jpg"): string => imgURL(`${card.deck}_${card.filename}`, ext, "lg");

export const getClass = (prefix: string, card: CardData): string => `${prefix}-${card.deck}-${card.filename}`;

export const largeClass = (card: CardData): string => getClass("lg", card);

export const smallClass = (card: CardData): string => getClass("sm", card);
