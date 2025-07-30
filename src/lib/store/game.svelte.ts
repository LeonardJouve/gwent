import type {CardData, UnitRow} from "$lib/types/card";
import type {FactionName} from "$lib/types/faction";
import type {Player} from "$lib/types/player";
import type {Weather} from "$lib/types/weather";
import cards from "$lib/cards";

type Row = {
    units: CardData[];
    hasWeather: boolean;
    special: {
        hasHorn: boolean;
        hasMardroeme: boolean;
    };
};

type PlayerData = {
    name: string;
    faction: FactionName;
    cards: CardData[];
    leader: CardData;
    isLeaderAvailable: boolean;
    hand: CardData[];
    grave: CardData[];
    gems: number;
    board: Record<UnitRow, Row>;
};

type GameStore = {
    selectedCard?: CardData;
    turn: Player;
    doubleSpyPower: boolean;
    halfWeather: boolean;
    randomRespawn: boolean;
    playerDatas: Record<Player, PlayerData>;
};

export const store = $state<GameStore>({
    turn: "me",
    doubleSpyPower: false,
    halfWeather: false,
    randomRespawn: false,
    playerDatas: {
        me: {
            name: "you",
            gems: 1,
            faction: "realms",
            cards: cards.filter(({deck, row}) => deck === "realms" && row !== "leader"),
            leader: cards.find(({deck, row}) => deck === "realms" && row === "leader")!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
            isLeaderAvailable: true,
            hand: cards.filter(({deck, row}) => deck === "realms" && row !== "leader").slice(0, 10),
            grave: cards.filter(({deck, row}) => deck === "realms" && row !== "leader").slice(0, 5),
            board: {
                close: {
                    units: cards.slice(0, 4),
                    hasWeather: true,
                    special: {
                        hasHorn: false,
                        hasMardroeme: false,
                    },
                },
                ranged: {
                    units: cards.slice(0, 2),
                    hasWeather: true,
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
        },
        opponent: {
            name: "opponent",
            gems: 2,
            faction: "monsters",
            cards: cards.filter(({deck, row}) => deck === "monsters" && row !== "leader"),
            leader: cards.find(({deck, row}) => deck === "monsters" && row === "leader")!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
            isLeaderAvailable: false,
            hand: cards.filter(({deck, row}) => deck === "monsters" && row !== "leader").slice(0, 10),
            grave: cards.filter(({deck, row}) => deck === "monsters" && row !== "leader").slice(0, 5),
            board: {
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
        },
    },
});

export const getCardScore = (card: CardData, rowName: UnitRow, player: Player): number => {
    let total = card.strength;

    if (card.abilities.includes("hero")) {
        return total;
    }

    if (hasWeather(rowName, player)) {
        if (store.halfWeather) {
            total = Math.ceil(total / 2);
        } else {
            total = Math.min(1, total);
        }
    }

    if (store.doubleSpyPower && card.abilities.includes("spy")) {
        total *= 2;
    }

    const bond = getBond(card.id, rowName, player);
    if (bond > 1) {
        total *= Number(bond);
    }

    total += getMoraleBoost(rowName, player) - (card.abilities.includes("morale") ? 1 : 0);

    if (getHorn(rowName, player) - (card.abilities.includes("horn") ? 1 : 0)) {
        total *= 2;
    }

    return total;
};

export const getRowScore = (rowName: UnitRow, player: Player): number => store.playerDatas[player].board[rowName].units.reduce((acc, card) => acc + getCardScore(card, rowName, player), 0);

export const getPlayerScore = (player: Player): number => Object.keys(store.playerDatas[player].board).reduce((acc, rowName) => acc + getRowScore(rowName as UnitRow, player), 0);

export const getBond = (cardId: CardData["id"], rowName: UnitRow, player: Player): number => store.playerDatas[player].board[rowName].units.filter((card) => card.id === cardId && card.abilities.includes("bond")).length;

export const getMoraleBoost = (rowName: UnitRow, player: Player): number => store.playerDatas[player].board[rowName].units.filter((card) => card.abilities.includes("morale")).length;

export const getHorn = (rowName: UnitRow, player: Player): number => {
    const row = store.playerDatas[player].board[rowName];

    return Number(row.special.hasHorn) + row.units.reduce((acc, {abilities}) => acc + Number(abilities.includes("horn")), 0);
};

export const hasMardroeme = (rowName: UnitRow, player: Player): boolean => {
    const row = store.playerDatas[player].board[rowName];

    return row.special.hasMardroeme || row.units.some(({abilities}) => abilities.includes("mardroeme"));
};

export const hasWeather = (rowName: UnitRow, player: Player): boolean => store.playerDatas[player].board[rowName].hasWeather;

export const getRowWeather = (rowName: UnitRow, player: Player): Weather|null => {
    if (!store.playerDatas[player].board[rowName].hasWeather) {
        return null;
    }

    const rowWeather: Record<UnitRow, Weather> = {
        close: "frost",
        ranged: "fog",
        siege: "rain",
    };

    return rowWeather[rowName];
};
