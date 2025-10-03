import Row from "./row.js";
import type {GameOptions, PlayerIndex} from "./types/game.js";
import type {CardData, SpecialCardData, UnitRow, WeatherCardData} from "../shared/types/card.js";
import type {Weather} from "../shared/types/weather.js";

type PlayerBoard = Record<UnitRow, Row>;

export default class Board {
    private board: PlayerBoard[];
    private weather: WeatherCardData[];
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
        return Array.from({length: 2}, () => ["close", "ranged", "siege"].reduce<PlayerBoard>((acc, row) => {
            acc[row as UnitRow] = new Row(this.getOptions.bind(this), () => this.getRowWeather(row as UnitRow));

            return acc;
        }, {} as PlayerBoard));
    }

    getWeather(): WeatherCardData[] {
        return this.weather;
    }

    getRowWeather(row: UnitRow): boolean {
        const weatherToRow: Record<Weather, UnitRow> = {
            frost: "close",
            fog: "ranged",
            rain: "siege",
        };

        return this.weather.some(({abilities}) => abilities.some((ability) => {
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

    addSpecial(row: UnitRow, playerIndex: PlayerIndex, card: SpecialCardData): void {
        this.getRow(row, playerIndex).addSpecial(card);
    }

    addWeather(card: WeatherCardData): void {
        this.weather.push(card);
    }

    clearWeather(): WeatherCardData[] {
        return this.weather = [];
    }

    getPlayerScore(player: PlayerIndex): number {
        return Object.values(this.board[player]).reduce((acc, row) => acc + row.getScore(), 0);
    }

    play(card: CardData, playerIndex: PlayerIndex, row?: UnitRow): void {
        if (card.type !== "unit" || !card.rows.length) {
            // TODO special / weather
            return;
        }

        const r = row ?? (card.abilities.includes("agile") ? "close" : card.rows[0]);

        // TODO check if card can be played on this row

        this.getRow(r, playerIndex).add(card);
    }
}
