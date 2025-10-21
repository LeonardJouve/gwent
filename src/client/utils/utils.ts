import type {CardData, SerializedCard} from "@shared/types/card";
import type {FactionName} from "@shared/types/faction";

export const imgURL = (file: string, ext: string, prefix?: string): string => `assets/img/${prefix ? `${prefix}/` : ""}${file}.${ext}`;

export const iconURL = (file: string, ext = "png"): string => imgURL(file, ext, "icons");

export const getClass = (prefix: string, card: CardData): string => `${prefix}-${card.faction}-${card.filename}`.replaceAll("_", "-");

export const largeClass = (card: CardData): string => getClass("lg", card);

export const smallClass = (card: CardData): string => getClass("sm", card);

export const backClass = (faction: FactionName): string => `lg-back-${faction}`;

export const sortCards = (cards: CardData[]): CardData[] => cards.sort((a, b) => {
    const typeRank = (card: CardData): number => {
        switch (true) {
        case card.type === "special" || card.abilities.includes("decoy"):
            return 0;
        case card.type === "weather":
            return 1;
        case card.abilities.includes("hero"):
            return 2;
        default:
            return 3;
        }
    };

    const typeDiff = typeRank(a) - typeRank(b);
    if (typeDiff) {
        return typeDiff;
    }

    const strengthDiff = (b.type === "unit" ? b.strength : 0) - (a.type === "unit" ? a.strength : 0);
    if (strengthDiff) {
        return strengthDiff;
    }

    return a.name.localeCompare(b.name);
});
