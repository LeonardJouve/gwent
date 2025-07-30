import Row from "$lib/server/row";
import type {CardData, UnitRow} from "$lib/types/card";
import type {Options, PlayerBoard, PlayerIndex} from "$lib/server/types/game";

export default class Board {
    private board: PlayerBoard[];
    private weather: CardData[];
    private getOptions: () => Options;

    constructor(getOptions: () => Options) {
        this.board = this.clearBoard();
        this.weather = this.clearWeather();
        this.getOptions = getOptions;
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

    scorch(row?: UnitRow, playerIndex?: PlayerIndex): void {

        // if (row !== undefined)
        //     row.cards.splice(row.cards.indexOf(card), 1);
        // let maxUnits = board.row.map(r => [r, r.maxUnits()]).filter(p => p[1].length > 0);
        // if (row !== undefined)
        //     row.cards.push(card);
        // let maxPower = maxUnits.reduce((a, p) => Math.max(a, p[1][0].power), 0);
        // let scorched = maxUnits.filter(p => p[1][0].power === maxPower);
        // let cards = scorched.reduce((a, p) => a.concat(p[1].map(u => [p[0], u])), []);

        // await Promise.all(cards.map(async u => await u[1].animate("scorch", true, false)));
        // await Promise.all(cards.map(async u => await board.toGrave(u[1], u[0])));
    }

    horn(row: UnitRow, playerIndex: PlayerIndex): void {
        this.getRow(row, playerIndex).horn();
    }

    mardroeme(row: UnitRow, playerIndex: PlayerIndex): void {
        this.getRow(row, playerIndex).mardroeme();
    }

    addWeather(card: CardData): void {
        this.weather.push(card);
        // TODO: set row weather
        // TODO: clear weather
        // getRowWeather(): Weather|null => {
        //     if (!store.playerDatas[player].board[rowName].hasWeather) {
        //         return null;
        //     }

        //     const rowWeather: Record<UnitRow, Weather> = {
        //         close: "frost",
        //         ranged: "fog",
        //         siege: "rain",
        //     };

        //     return rowWeather[rowName];
        // };
    }

    clearWeather(): CardData[] {
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
