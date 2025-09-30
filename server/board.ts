import Row from "./row.js";
import type {GameOptions, PlayerIndex} from "./types/game.js";
import type {CardData, UnitRow} from "../shared/types/card.js";
import type {Weather} from "../shared/types/weather.js";

type PlayerBoard = Record<UnitRow, Row>;

export default class Board {
    private board: PlayerBoard[];
    private weather: CardData[];
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
        return this.board = [
            {
                close: new Row(this.getOptions.bind(this)),
                ranged: new Row(this.getOptions.bind(this)),
                siege: new Row(this.getOptions.bind(this)),
            },
            {
                close: new Row(this.getOptions.bind(this)),
                ranged: new Row(this.getOptions.bind(this)),
                siege: new Row(this.getOptions.bind(this)),
            },
        ];
    }

    getRow(row: UnitRow, playerIndex: PlayerIndex): Row {
        return this.board[playerIndex][row];
    }

    getPlayerBoard(playerIndex: PlayerIndex): PlayerBoard {
        return this.board[playerIndex];
    }

    horn(row: UnitRow, playerIndex: PlayerIndex): void {
        this.getRow(row, playerIndex).horn();
    }

    mardroeme(row: UnitRow, playerIndex: PlayerIndex): void {
        this.getRow(row, playerIndex).mardroeme();
    }

    addWeather(card: CardData): void {
        const weatherRow: Record<Weather, UnitRow> = {
            frost: "close",
            fog: "ranged",
            rain: "siege",
        };

        this.weather.push(card);


        this.board.forEach((playerBoard) => {
            card.abilities.forEach((ability) => {
                if (!(ability in weatherRow)) {
                    return;
                }

                playerBoard[weatherRow[ability as keyof typeof weatherRow]].setWeather(true);
            });
        });
    }

    clearWeather(): CardData[] {
        this.board.forEach((playerBoard) => Object.values(playerBoard).forEach((row) => row.setWeather(false)));
        return this.weather = [];
    }

    getPlayerScore(player: PlayerIndex): number {
        return Object.values(this.board[player]).reduce((acc, row) => acc + row.getScore(), 0);
    }

    play(card: CardData, playerIndex: PlayerIndex, row?: UnitRow): void {
        if (card.type !== "unit" || !card.rows.length) {
            // TODO special / weather / decoy
            return;
        }

        const r = row ?? (card.abilities.includes("agile") ? "close" : card.rows[0]);

        // TODO check if card can be played on this row

        this.getRow(r, playerIndex).add(card);
    }
}
