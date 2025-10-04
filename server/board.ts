import Row from "./row.js";
import type {GameOptions, PlayerIndex} from "./types/game.js";
import type {SpecialCardData, UnitCardData, UnitRow, WeatherCardData} from "../shared/types/card.js";
import type {Weather} from "../shared/types/weather.js";

type PlayerBoard = Record<UnitRow, Row>;

export default class Board {
    private board: PlayerBoard[];
    private weather: WeatherCardData[][];
    private getOptions: () => GameOptions;

    constructor(getOptions: () => GameOptions) {
        this.getOptions = getOptions;
        this.board = this.clearBoard();
        this.weather = this.clearWeather();
    }

    clear(): void {
        this.clearBoard();
        this.clearWeather();
    }

    clearBoard(): PlayerBoard[] {
        return this.board = Array.from({length: 2}, () => ["close", "ranged", "siege"].reduce<PlayerBoard>((acc, row) => {
            acc[row as UnitRow] = new Row(this.getOptions.bind(this), () => this.getRowWeather(row as UnitRow));

            return acc;
        }, {} as PlayerBoard));
    }

    getWeather(): WeatherCardData[] {
        return this.weather.flat();
    }

    getPlayerWeather(playerIndex: PlayerIndex): WeatherCardData[] {
        return this.weather[playerIndex];
    }

    getRowWeather(row: UnitRow): boolean {
        const weatherToRow: Record<Weather, UnitRow> = {
            frost: "close",
            fog: "ranged",
            rain: "siege",
        };

        return this.getWeather().some(({abilities}) => abilities.some((ability) => {
            if (!(ability in weatherToRow)) {
                return false;
            }

            return row === weatherToRow[ability as keyof typeof weatherToRow];
        }));
    }

    getRow(row: UnitRow, playerIndex: PlayerIndex): Row {
        return this.board[playerIndex][row];
    }

    getPlayerBoard(playerIndex: PlayerIndex): PlayerBoard {
        return this.board[playerIndex];
    }

    playSpecial(card: SpecialCardData, playerIndex: PlayerIndex, row: UnitRow): void {
        this.getRow(row, playerIndex).addSpecial(card);
    }

    playWeather(card: WeatherCardData, playerIndex: PlayerIndex): void {
        this.weather[playerIndex].push(card);
    }

    clearWeather(): WeatherCardData[][] {
        return this.weather = [[], []];
    }

    getPlayerScore(player: PlayerIndex): number {
        return Object.values(this.board[player]).reduce((acc, row) => acc + row.getScore(), 0);
    }

    playUnit(card: UnitCardData, playerIndex: PlayerIndex, row: UnitRow): boolean {
        if (!card.rows.includes(row)) {
            return false;
        }

        this.getRow(row, playerIndex).add(card);

        return true;
    }
}
