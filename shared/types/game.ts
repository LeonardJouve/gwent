import type {CardData, SpecialCardData, UnitCardData, UnitRow, WeatherCardData} from "./card.js";
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

export type UnitCardWithScore = {
    card: UnitCardData;
    score: number;
};

export type Row = {
    units: UnitCardWithScore[];
    special: SpecialCardData[];
};

export type PlayerBoard = Record<UnitRow, Row>;

export type Board = {
    rows: Record<PlayerIndicator, PlayerBoard>;
    weather: WeatherCardData[];
};

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
