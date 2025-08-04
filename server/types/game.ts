export type GameOptions = {
    doubleSpyPower: boolean;
    halfWeather: boolean;
    randomRespawn: boolean;
};

export type PlayerIndex = number;

export type RoundResult = {
    winner: PlayerIndex|null;
    scores: number[];
};
