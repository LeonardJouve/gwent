import cards from "$lib/cards";
import type {CardData, UnitRow} from "$lib/types/card";
import type {Player} from "$lib/types/player";

type Row = {
    units: CardData[];
    specials: CardData[];
};

type BoardStore = Record<Player, Record<UnitRow, Row>>;

export const store = $state<BoardStore>({
    opponent: {
        close: {
            units: [],
            specials: [],
        },
        ranged: {
            units: [],
            specials: [],
        },
        siege: {
            units: [],
            specials: [],
        },
    },
    me: {
        close: {
            units: cards.slice(0, 3),
            specials: [],
        },
        ranged: {
            units: cards.slice(0, 2),
            specials: [],
        },
        siege: {
            units: cards.slice(0, 1),
            specials: [cards.find(({ability}) => ability === "horn")!], // eslint-disable-line @typescript-eslint/no-non-null-assertion
        },
    },
});
