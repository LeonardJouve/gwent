import Row from "$lib/server/row";
import type {CardData, UnitRow} from "$lib/types/card";
import type {Options, PlayerBoard, PlayerIndex} from "$lib/server/types/game";
import type {Weather} from "$lib/types/weather";

export default class Board {
    private board: PlayerBoard[];
    private weather: CardData[];
    private getOptions: () => Options;

    constructor(getOptions: () => Options) {
        this.board = this.clearBoard();
        this.weather = this.clearWeather();
        this.getOptions = getOptions;
    }

    clear(): void {
        this.clearBoard();
        this.clearWeather();
    }

    clearBoard(): PlayerBoard[] {
        return this.board = [
            {
                close: new Row(this.getOptions),
                ranged: new Row(this.getOptions),
                siege: new Row(this.getOptions),
            },
            {
                close: new Row(this.getOptions),
                ranged: new Row(this.getOptions),
                siege: new Row(this.getOptions),
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

    autoplay(card: CardData, playerIndex: PlayerIndex): void {
        const row = card.row === "agile" ? "close" : card.row;
        if (!row) {
            return;
        }

        this.getRow(row, playerIndex).add(card);
    }
}
