import type {CardData} from "$lib/types/card";
import cards from "$lib/cards";
import type {FactionName} from "$lib/types/faction";
import type {Player} from "$lib/types/player";

type Deck = {
    faction: FactionName;
    cards: CardData[];
    leader: CardData;
    isLeaderAvailable: boolean;
    hand: CardData[];
};

type DeckStore = Record<Player, Deck>;

export const store = $state<DeckStore>({
    opponent: {
        faction: "monsters",
        cards: cards.filter(({deck}) => deck === "monsters").slice(0, 30),
        leader: cards.find(({deck, row}) => deck === "monsters" && row === "leader")!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        isLeaderAvailable: false,
        hand: cards.filter(({deck}) => deck === "monsters").slice(0, 10),
    },
    me: {
        faction: "realms",
        cards: cards.filter(({deck}) => deck === "realms").slice(0, 30),
        leader: cards.find(({deck, row}) => deck === "realms" && row === "leader")!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        isLeaderAvailable: true,
        hand: cards.filter(({deck}) => deck === "realms").slice(0, 10),
    },
});
