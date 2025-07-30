import type {CardData, UnitRow} from "$lib/types/card";
import type {FactionName} from "$lib/types/faction";
import type Cards from "$lib/server/cards";
import type Row from "$lib/server/row";

export type RowSpecial = {
    hasHorn: boolean;
    hasMardroeme: boolean;
};

export type Options = {
    doubleSpyPower: boolean;
    halfWeather: boolean;
    randomRespawn: boolean;
};

export type PlayerBoard = Record<UnitRow, Row>;

export type Board = PlayerBoard[];

export type PlayerData = {
    name: string;
    faction: FactionName;
    leader: CardData;
    deck: CardData[];
};

export type Player = Omit<PlayerData, "deck"> & {
    isLeaderAvailable: boolean;
    cards: Cards;
    gems: number;
    hasPassed: boolean;
};

export type PlayerIndex = number;

export type RoundResult = {
    winner: PlayerIndex|null;
    scores: number[];
};

export type Effect = {
    once: boolean;
    run: () => void;
};
