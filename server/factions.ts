import Cards from "./cards";
import type Game from "./game";
import type {PlayerIndex} from "./types/game";
import type {UnitRow} from "../shared/types/card";
import type {FactionName} from "../shared/types/faction";

type FactionAbility = (game: Game, playerIndex: PlayerIndex) => void;

const factions: Record<FactionName, FactionAbility> = {
    realms: (game, playerIndex) => {
        game.onRoundStart.push({
            once: false,
            run: () => {
                if (game.getLastRoundResult()?.winner !== playerIndex) {
                    return;
                }

                game.getPlayerCards(playerIndex).draw();
            },
        });
    },
    nilfgaard: (game, playerIndex) => {
        game.onRoundEnd.push({
            once: false,
            run: () => {
                const lastRoundResult = game.getLastRoundResult();
                const isLastRoundDraw = lastRoundResult !== null && lastRoundResult.winner === null;

                if (game.playersHaveSameFaction() || !isLastRoundDraw) {
                    return;
                }

                lastRoundResult.winner = playerIndex;
            },
        });
    },
    monsters: (game, playerIndex) => {
        game.onRoundEnd.push({
            once: false,
            run: () => {
                const units = Object.entries(game.board.getPlayerBoard(playerIndex))
                    .flatMap(([name, row]) => row
                        .getUnits()
                        .map((card) => ({card, row: name as UnitRow})));

                if (!units.length) {
                    return;
                }

                const {card, row} = units[Math.floor(Math.random() * units.length)];

                game.onRoundStart.push({
                    once: true,
                    run: () => {
                        game.getPlayerCards(playerIndex).restore(card);
                        game.board.getRow(row, playerIndex).add(card);
                    },
                });
            },
        });
    },
    scoiatael: (game) => {
        game.onGameStart.push({
            once: true,
            run: async () => {
                if (game.playersHaveSameFaction()) {
                    return;
                }

                game.currentPlayerIndex = await game.askStart();
            },
        });
    },
    skellige: (game, playerIndex) => {
        game.onRoundStart.push({
            once: false,
            run: () => {
                if (game.getRoundCount() !== 3) {
                    return;
                }

                const cards = Cards.getRandom(game.getPlayerCards(playerIndex)
                    .grave
                    .filter(Cards.isUnit), 2);

                game.getPlayerCards(playerIndex).restore(...cards);
                cards.forEach((card) => game.board.autoplay(card, playerIndex));
            },
        });
    },
};

export default factions;
