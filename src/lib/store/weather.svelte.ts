import type {CardData} from "$lib/types/card";
import cards from "$lib/cards";

type WeatherStore = {
    cards: CardData[];
};

export const store = $state<WeatherStore>({
    cards: cards.filter(({deck}) => deck === "weather").slice(0, 3), // [],
});
