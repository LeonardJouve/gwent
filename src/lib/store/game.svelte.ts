import type {CardData, UnitRow} from "@shared/types/card";
import type {PlayerIndicator} from "@shared/types/player";
import type {PlayerBoard, State} from "@shared/types/game";
import type {Weather} from "@shared/types/weather";
import cards from "@shared/cards";

type GameStore = State & {
    selectedCard?: CardData;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const leader = cards.find(({deck, abilities}) => deck === "realms" && abilities.includes("leader"))!;

export const store = $state<GameStore>({
    turn: "me",
    players: {
        me: {
            name: "",
            hasPassed: false,
            gems: 2,
            faction: "realms",
            leader,
            isLeaderAvailable: true,
            deck: [],
            hand: [],
            grave: [],
        },
        opponent: {
            name: "",
            hasPassed: false,
            gems: 2,
            faction: "realms",
            leader,
            isLeaderAvailable: true,
            deckSize: 0,
            handSize: 0,
            grave: [],
        },
    },
    board: {
        me: {
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
    },
});

export const getPlayerScore = (player: PlayerIndicator): number => Object.keys(store.board[player])
    .reduce((acc, rowName) => acc + getRowScore(rowName as keyof PlayerBoard, player), 0);

export const getRowScore = (rowName: UnitRow, player: PlayerIndicator): number => store.board[player][rowName].units
    .reduce((acc, {score}) => acc + score, 0);

export const getRowWeather = (rowName: UnitRow, player: PlayerIndicator): Weather|null => {
    if (!store.board[player][rowName].hasWeather) {
        return null;
    }

    const rowWeather: Record<UnitRow, Weather> = {
        close: "frost",
        ranged: "fog",
        siege: "rain",
    };

    return rowWeather[rowName];
};
