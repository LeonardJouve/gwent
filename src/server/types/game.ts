import { Player } from "@shared/types/game.js";
import Cards from "../cards.js";

export type GameOptions = {
    doubleSpyPower: boolean;
    halfWeather: boolean;
    randomRespawn: boolean;
};

export type PlayerId = string;

export type RoundResult = {
    winner: PlayerId|null;
    scores: Record<PlayerId, number>;
};

export type GamePlayer = Omit<Player, "grave"> & {
    cards: Cards;
};
