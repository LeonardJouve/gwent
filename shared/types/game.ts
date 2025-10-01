import type {CardData, UnitRow} from "./card.js";
import type {Deck} from "./deck.js";
import type {PlayerIndicator} from "./player.js";

export type Play = {
    type: "pass"|"leader";
    card?: undefined;
    row?: undefined;
} | {
    type: "card";
    card: CardData["filename"];
    row?: UnitRow;
};

export type RowSpecial = {
    hasHorn: boolean;
    hasMardroeme: boolean;
};

export type CardWithScore = {
    card: CardData;
    score: number;
};

export type Row = {
    units: CardWithScore[];
    hasWeather: boolean;
    special: RowSpecial;
};

export type PlayerBoard = Record<UnitRow, Row>;

export type Board = Record<PlayerIndicator, PlayerBoard>;

export type Player = Omit<Deck, "deck"> & {
    isLeaderAvailable: boolean;
    gems: number;
    hasPassed: boolean;
    grave: CardData[];
};

type Opponent = Player & {
    deckSize: number;
    handSize: number;
    deck?: undefined;
    hand?: undefined;
};

type Me = Player & {
    deck: CardData[];
    hand: CardData[];
    deckSize?: undefined;
    handSize?: undefined;
};

export type State = {
    turn: PlayerIndicator;
    players: {
        me: Me;
        opponent: Opponent;
    };
    board: Board;
};

export type RoundResult = {
    winner: PlayerIndicator|null;
    scores: Record<PlayerIndicator, number>;
};
