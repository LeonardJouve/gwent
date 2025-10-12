import type {CardData} from "@shared/types/card";
import type {FactionName} from "@shared/types/faction";

export const imgURL = (file: string, ext: string, prefix?: string): string => `assets/img/${prefix ? `${prefix}/` : ""}${file}.${ext}`;

export const iconURL = (file: string, ext = "png"): string => imgURL(file, ext, "icons");

export const getClass = (prefix: string, card: CardData): string => `${prefix}-${card.faction}-${card.filename}`.replaceAll("_", "-");

export const largeClass = (card: CardData): string => getClass("lg", card);

export const smallClass = (card: CardData): string => getClass("sm", card);

export const backClass = (faction: FactionName): string => `lg-back-${faction}`;

type CardWithAmount = CardData & {amount: number};
export const getCardsWithAmount = (cards: CardData[]): Map<CardData["filename"], CardWithAmount> => cards.reduce<Map<CardData["filename"], CardWithAmount>>((acc, card) => {
    const previousCard = acc.get(card.filename);
    if (previousCard) {
        previousCard.amount += 1;
    } else {
        acc.set(card.filename, {...card, amount: 1});
    }

    return acc;
}, new Map());
