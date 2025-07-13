import cards from "$lib/cards";
import type {CardData, UnitRow} from "$lib/types/card";
import type {Player} from "$lib/types/player";

type Row = {
    units: CardData[];
    hasWeather: boolean;
    special: {
        hasHorn: boolean;
        hasMardroeme: boolean;
    };
};

type BoardStore = Record<Player, Record<UnitRow, Row>>;

export const store = $state<BoardStore>({
    opponent: {
        close: {
            units: [],
            hasWeather: false,
            special: {
                hasHorn: false,
                hasMardroeme: false,
            },
        },
        ranged: {
            units: [],
            hasWeather: false,
            special: {
                hasHorn: false,
                hasMardroeme: false,
            },
        },
        siege: {
            units: [],
            hasWeather: false,
            special: {
                hasHorn: false,
                hasMardroeme: false,
            },
        },
    },
    me: {
        close: {
            units: cards.slice(0, 10),
            hasWeather: false,
            special: {
                hasHorn: false,
                hasMardroeme: false,
            },
        },
        ranged: {
            units: cards.slice(0, 2),
            hasWeather: false,
            special: {
                hasHorn: false,
                hasMardroeme: false,
            },
        },
        siege: {
            units: cards.slice(0, 1),
            hasWeather: true,
            special: {
                hasHorn: false,
                hasMardroeme: false,
            },
        },
    },
});

export const getCardScore = (card: CardData, rowName: UnitRow, player: Player): number => {
    let total = card.strength;

    if (card.abilities.includes("hero")) {
        return total;
    }

    if (hasWeather(rowName, player)) {
        total = Math.min(1, total);
    }
    if (/* doubleSpyPower TODO && */card.abilities.includes("spy")) {
        total *= 2;
    }

    const bond = getBond(card.id, rowName, player);
    if (bond > 1) {
        total *= Number(bond);
    }

    total += Math.max(0, getMoraleBoost(rowName, player) - (card.abilities.includes("morale") ? 1 : 0));

    if (hasHorn(rowName, player)) {
        total *= 2;
    }

    return total;
};

export const getRowScore = (rowName: UnitRow, player: Player): number => store[player][rowName].units.reduce((acc, card) => acc + getCardScore(card, rowName, player), 0);

export const getPlayerScore = (player: Player): number => Object.keys(store[player]).reduce((acc, rowName) => acc + getRowScore(rowName as UnitRow, player), 0);

export const getBond = (cardId: CardData["id"], rowName: UnitRow, player: Player): number => store[player][rowName].units.filter((card) => card.id === cardId && card.abilities.includes("bond")).length;

export const getMoraleBoost = (rowName: UnitRow, player: Player): number => store[player][rowName].units.filter((card) => card.abilities.includes("morale")).length;

export const hasHorn = (rowName: UnitRow, player: Player): boolean => {
    const row = store[player][rowName];

    return row.special.hasHorn || row.units.some(({abilities}) => abilities.includes("horn"));
};

export const hasMardroeme = (rowName: UnitRow, player: Player): boolean => {
    const row = store[player][rowName];

    return row.special.hasMardroeme || row.units.some(({abilities}) => abilities.includes("mardroeme"));
};

export const hasWeather = (rowName: UnitRow, player: Player): boolean => store[player][rowName].hasWeather;
