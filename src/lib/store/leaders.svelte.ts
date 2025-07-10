import type {CardData} from "$lib/types/card";
import type {Player} from "$lib/types/player";
import cards from "$lib/cards";

type Leader = {
    leader?: CardData;
    available: boolean;
};

type LeadersStore = Record<Player, Leader>;

export const store = $state<LeadersStore>({
    me: {
        leader: cards.find(({row}) => row === "leader"),
        available: true,
    },
    opponent: {
        available: false,
    },
});
