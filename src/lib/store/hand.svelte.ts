import type {CardData} from "$lib/types/card";
import cards from "$lib/cards";

type HandStore = {
    cards: CardData[];
};

export const store = $state<HandStore>({
    cards: cards.slice(0, 10), // [],
});
