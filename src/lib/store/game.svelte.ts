import type {CardData, UnitRow} from "@shared/types/card";
import type {FactionName} from "@shared/types/faction";
import type {PlayerIndicator} from "@shared/types/player";
import type {PlayerBoard} from "@shared/types/game";
import type {Weather} from "@shared/types/weather";
import cards from "@shared/cards";

type PlayerData = {
    name: string;
    faction: FactionName;
    cards: CardData[];
    leader: CardData;
    isLeaderAvailable: boolean;
    hand: CardData[];
    grave: CardData[];
    gems: number;
    board: PlayerBoard;
};

type GameStore = {
    selectedCard?: CardData;
    turn: PlayerIndicator;
    doubleSpyPower: boolean;
    halfWeather: boolean;
    randomRespawn: boolean;
    playerDatas: Record<PlayerIndicator, PlayerData>;
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
            cards: cards.filter(({deck}) => deck === "realms"),
            leader: cards.find(({deck, abilities}) => deck === "realms" && abilities.includes("leader"))!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
            isLeaderAvailable: true,
            hand: cards.filter(({deck}) => deck === "realms").slice(0, 10),
            grave: cards.filter(({deck}) => deck === "realms").slice(0, 5),
            board: {
                close: {
                    units: cards.slice(0, 4).map((card) => ({card, score: card.strength})),
                    hasWeather: true,
                    special: {
                        hasHorn: false,
                        hasMardroeme: false,
                    },
                },
                ranged: {
                    units: cards.slice(0, 2).map((card) => ({card, score: card.strength})),
                    hasWeather: true,
                    special: {
                        hasHorn: false,
                        hasMardroeme: false,
                    },
                },
                siege: {
                    units: cards.slice(0, 1).map((card) => ({card, score: card.strength})),
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
            cards: cards.filter(({deck}) => deck === "monsters"),
            leader: cards.find(({deck, abilities}) => deck === "monsters" && abilities.includes("leader"))!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
            isLeaderAvailable: false,
            hand: cards.filter(({deck}) => deck === "monsters").slice(0, 10),
            grave: cards.filter(({deck}) => deck === "monsters").slice(0, 5),
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

export const getPlayerScore = (player: PlayerIndicator): number => Object.keys(store.playerDatas[player].board)
    .reduce((acc, rowName) => acc + getRowScore(rowName as keyof PlayerBoard, player), 0);

export const getRowScore = (rowName: UnitRow, player: PlayerIndicator): number => store.playerDatas[player].board[rowName].units
    .reduce((acc, {score}) => acc + score, 0);

export const getRowWeather = (rowName: UnitRow, player: PlayerIndicator): Weather|null => {
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
