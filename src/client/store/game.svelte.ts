import type {CardData, UnitRow} from "@shared/types/card";
import type {PlayerIndicator} from "@shared/types/player";
import type {Play, PlayerBoard, RoundResult, State} from "@shared/types/game";
import type {Weather} from "@shared/types/weather";
import cards from "@shared/cards";

type GameResult = {
    results: RoundResult[];
    winner: PlayerIndicator|null;
};

type GameStore = State & {
    selectedIndex?: number;
    askPlay?: (play: Play) => void;
    askStart?: (player: PlayerIndicator) => void;
    result?: GameResult;
};

const leader = cards["foltest_silver"];
if (leader?.type !== "leader") {
    throw new Error("leader not found");
}

const getEmptyGame = (): GameStore => ({
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
        rows: {
            me: {
                close: {
                    units: [],
                    special: [],
                },
                ranged: {
                    units: [],
                    special: [],
                },
                siege: {
                    units: [],
                    special: [],
                },
            },
            opponent: {
                close: {
                    units: [],
                    special: [],
                },
                ranged: {
                    units: [],
                    special: [],
                },
                siege: {
                    units: [],
                    special: [],
                },
            },
        },
        weather: [],
    },
});

export const resetGame = () => {
    const emptyGame = getEmptyGame();

    store.askPlay = undefined;
    store.askStart = undefined;
    store.result = undefined;
    store.selectedIndex = undefined;
    store.turn = "me";
    store.board = emptyGame.board;
    store.players = emptyGame.players;
};

export const store = $state<GameStore>(getEmptyGame());

export const getPlayerScore = (player: PlayerIndicator): number => Object.keys(store.board.rows[player])
    .reduce((acc, rowName) => acc + getRowScore(rowName as keyof PlayerBoard, player), 0);

export const getRowScore = (rowName: UnitRow, player: PlayerIndicator): number => store.board.rows[player][rowName].units
    .reduce((acc, {score}) => acc + score, 0);

export const getRowWeather = (rowName: UnitRow): Weather|null => {
    const weatherToRow: Record<Weather, UnitRow> = {
        frost: "close",
        fog: "ranged",
        rain: "siege",
    };

    for (const {abilities} of store.board.weather) {
        const weather = abilities.find((ability): ability is Weather => ability in weatherToRow && weatherToRow[ability as keyof typeof weatherToRow] === rowName);
        if (weather) {
            return weather;
        }
    }

    return null;
};
