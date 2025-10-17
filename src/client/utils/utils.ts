import type {CardData, LeaderCardData} from "@shared/types/card";
import type {FactionName} from "@shared/types/faction";
import premadeDecks from "@shared/decks";
import cards from "@shared/cards";

export const imgURL = (file: string, ext: string, prefix?: string): string => `assets/img/${prefix ? `${prefix}/` : ""}${file}.${ext}`;

export const iconURL = (file: string, ext = "png"): string => imgURL(file, ext, "icons");

export const getClass = (prefix: string, card: CardData): string => `${prefix}-${card.faction}-${card.filename}`.replaceAll("_", "-");

export const largeClass = (card: CardData): string => getClass("lg", card);

export const smallClass = (card: CardData): string => getClass("sm", card);

export const backClass = (faction: FactionName): string => `lg-back-${faction}`;

type CardWithAmount = CardData & {amount: number};
export const getCardsWithAmount = (c: CardData[]): Map<CardData["filename"], CardWithAmount> => c.reduce<Map<CardData["filename"], CardWithAmount>>((acc, card) => {
    const previousCard = acc.get(card.filename);
    if (previousCard) {
        previousCard.amount += 1;
    } else {
        acc.set(card.filename, {...card, amount: 1});
    }

    return acc;
}, new Map());

export const sortCards = (c: CardData[]): CardData[] => c.sort((a, b) => {
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

type Deck = {
    leader: LeaderCardData;
    cards: CardData[];
};
export const getLastDeck = (faction: FactionName): Deck => {
    const deck = premadeDecks[faction];

    const leader = cards.find(({filename}) => filename === deck.leader);
    if (!leader || leader.type !== "leader") {
        throw new Error(`premade deck ${faction} has invalid leader`);
    }

    return {
        leader,
        cards: Object.entries(deck.cards).flatMap(([name, amount]) => {
            const card = cards.find(({filename}) => filename === name);
            if (!card || card.type === "leader" || card.faction !== "neutral" && card.faction !== faction) {
                throw new Error(`premade deck ${faction} has invalid card ${name}`);
            }

            return Array.from({length: amount}, () => card);
        }),
    };
};
