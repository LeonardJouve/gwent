import cards, {stackCards} from "@shared/cards";
import {FactionNameSchema, type FactionName} from "@shared/types/faction";
import {SerializedDeckSchema, type SerializedDeck} from "@shared/types/deck";
import type {CardData, LeaderCardData} from "@shared/types/card";
import premadeDecks from "@shared/decks";

const LAST_FACTION_KEY = "last-faction";

const getFactionDeckKey = (faction: FactionName): string => `deck-${faction}`;

export const setLastFaction = (faction: FactionName): void => {
    localStorage.setItem(LAST_FACTION_KEY, faction);
};

export const getLastFaction = (): FactionName|null => {
    const lastFaction = localStorage.getItem(LAST_FACTION_KEY);
    return FactionNameSchema.safeParse(lastFaction).data || null;
};

export const setFactionDeck = (faction: FactionName, deck: CardData[], leader: LeaderCardData): void => {
    localStorage.setItem(getFactionDeckKey(faction), JSON.stringify({
        leader: leader.filename,
        cards: Array.from(stackCards(deck)).reduce<SerializedDeck["cards"]>((acc, [filename, card]) => {
            acc[filename] = card.amount;

            return acc;
        }, {}),
    }));
};

type Deck = {
    leader: LeaderCardData;
    cards: CardData[];
};
export const getFactionDeck = (faction: FactionName): Deck => {
    const jsonDeck = localStorage.getItem(getFactionDeckKey(faction));

    let deck = premadeDecks[faction];
    if (jsonDeck) {
        try {
            const parsedDeck = JSON.parse(jsonDeck);
            deck = SerializedDeckSchema.parse(parsedDeck);
        } catch (e) {
            console.error("failed to parse deck", jsonDeck, e);
        }
    }

    const leader = cards[deck.leader];
    if (leader?.type !== "leader") {
        throw new Error(`deck ${faction} has invalid leader`);
    }

    return {
        leader,
        cards: Object.entries(deck.cards).flatMap(([name, amount]) => {
            const card = cards[name];
            if (!card || card.type === "leader" || card.faction !== "neutral" && card.faction !== faction) {
                throw new Error(`deck ${faction} has invalid card ${name}`);
            }

            return Array.from({length: amount}, () => card);
        }),
    };
};

const LAST_USERNAME_KEY = "last-username";

export const setLastUsername = (username: string): void => {
    localStorage.setItem(LAST_USERNAME_KEY, username);
};

export const getLastUsername = (): string|null => {
    const lastUsername = localStorage.getItem(LAST_USERNAME_KEY);
    return lastUsername || null;
};
