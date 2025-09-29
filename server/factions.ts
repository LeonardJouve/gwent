import Cards from "./cards";
import type Game from "./game";
import type {PlayerIndex} from "./types/game";
import type {FactionName} from "../shared/types/faction";
import type {PlayerBoard} from "../shared/types/game";

type FactionAbility = (game: Game, playerIndex: PlayerIndex) => void;

const factions: Record<FactionName, FactionAbility> = {
    realms: (game, playerIndex) => {
        game.onRoundStart.push({
            once: false,
            run: async () => {
                if (game.getLastRoundResult()?.winner !== playerIndex) {
                    return;
                }

                game.getPlayerCards(playerIndex).draw();

                game.players.forEach((_, i) => game.listeners.notify(i, "north"));
            },
        });
    },
    nilfgaard: (game, playerIndex) => {
        game.onRoundEnd.push({
            once: false,
            run: async () => {
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
            run: async () => {
                const units = Object.entries(game.board.getPlayerBoard(playerIndex))
                    .flatMap(([rowName, row]) => row
                        .getUnits()
                        .map((card) => ({card, row: rowName as keyof PlayerBoard})));

                if (!units.length) {
                    return;
                }

                const {card, row} = units[Math.floor(Math.random() * units.length)];

                game.onRoundStart.push({
                    once: true,
                    run: async () => {
                        game.getPlayerCards(playerIndex).restore(card);
                        game.board.getRow(row, playerIndex).add(card);

                        game.players.forEach((_, i) => game.listeners.notify(i, "monsters"));
                    },
                });
            },
        });
    },
    scoiatael: (game, playerIndex) => {
        game.onGameStart.push({
            once: true,
            run: async () => {
                if (game.playersHaveSameFaction()) {
                    return;
                }

                game.currentPlayerIndex = await game.listeners.askStart(playerIndex);

                game.players.forEach((_, i) => game.listeners.notify(i, `scoiatael_${game.currentPlayerIndex === i ? "me" : "op"}`));
            },
        });
    },
    skellige: (game, playerIndex) => {
        game.onRoundStart.push({
            once: false,
            run: async () => {
                if (game.getRoundCount() !== 3) {
                    return;
                }

                const cards = Cards.getRandom(game.getPlayerCards(playerIndex)
                    .grave
                    .filter(Cards.isNormalUnit), 2);

                game.getPlayerCards(playerIndex).restore(...cards);
                cards.forEach((card) => game.board.play(card, playerIndex));

                game.players.forEach((_, i) => game.listeners.notify(i, `skellige_${game.currentPlayerIndex === i ? "me" : "op"}`));
            },
        });
    },
};

export default factions;
