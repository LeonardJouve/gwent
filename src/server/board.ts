import Row from "./row.js";
import type {GameOptions, PlayerId} from "./types/game.js";
import type {SpecialCardData, UnitCardData, UnitRow, WeatherCardData} from "@shared/types/card.js";
import type {Weather} from "@shared/types/weather.js";

type PlayerBoard = Record<UnitRow, Row>;

export default class Board {
    private playerIds: PlayerId[];
    private board: Record<PlayerId, PlayerBoard>;
    private weather: Record<PlayerId, WeatherCardData[]>;
    private getOptions: () => GameOptions;

    constructor(getOptions: () => GameOptions, playerIds: PlayerId[]) {
        this.playerIds = playerIds;
        this.getOptions = getOptions;
        this.board = this.clearBoard();
        this.weather = this.clearWeather();
    }

    clear(): void {
        this.clearBoard();
        this.clearWeather();
    }

    clearBoard(): Record<PlayerId, PlayerBoard> {
        return this.board = Object.fromEntries(this.playerIds.map((id) => [id, ["close", "ranged", "siege"].reduce<PlayerBoard>((acc, row) => {
            acc[row as UnitRow] = new Row(this.getOptions.bind(this), () => this.getRowWeather(row as UnitRow));

            return acc;
        }, {} as PlayerBoard)]));
    }

    getWeather(): WeatherCardData[] {
        return Object.values(this.weather).flat();
    }

    getPlayerWeather(playerId: PlayerId): WeatherCardData[] {
        return this.weather[playerId];
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

    getRow(row: UnitRow, playerId: PlayerId): Row {
        return this.board[playerId][row];
    }

    getPlayerBoard(playerId: PlayerId): PlayerBoard {
        return this.board[playerId];
    }

    playSpecial(card: SpecialCardData, playerId: PlayerId, row: UnitRow): void {
        this.getRow(row, playerId).addSpecial(card);
    }

    playWeather(card: WeatherCardData, playerId: PlayerId): void {
        this.weather[playerId].push(card);
    }

    clearWeather(): Record<PlayerId, WeatherCardData[]> {
        return this.weather = Object.fromEntries(this.playerIds.map((id) => [id, []]));
    }

    getPlayerScore(playerId: PlayerId): number {
        return Object.values(this.board[playerId]).reduce((acc, row) => acc + row.getScore(), 0);
    }

    playUnit(card: UnitCardData, playerId: PlayerId, row: UnitRow): boolean {
        if (!card.rows.includes(row)) {
            return false;
        }

        this.getRow(row, playerId).add(card);

        return true;
    }
}
