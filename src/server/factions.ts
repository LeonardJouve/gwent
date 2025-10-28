import Cards from "./cards.js";
import type Game from "./game.js";
import type {PlayerId} from "./types/game.js";
import type {FactionName} from "@shared/types/faction.js";
import type {PlayerBoard} from "@shared/types/game.js";

type FactionAbility = (game: Game, playerId: PlayerId) => void;

const factions: Record<FactionName, FactionAbility> = {
    realms: (game, playerId) => {
        game.onRoundStart.push({
            once: false,
            run: async () => {
                if (game.getLastRoundResult()?.winner !== playerId) {
                    return;
                }

                game.getPlayerCards(playerId).draw();

                Object.keys(game.players).forEach((id) => game.listeners.notify(id, "north"));
            },
        });
    },
    nilfgaard: (game, playerId) => {
        game.onRoundEnd.push({
            once: false,
            run: async () => {
                const lastRoundResult = game.getLastRoundResult();
                const isLastRoundDraw = lastRoundResult !== null && lastRoundResult.winner === null;

                if (game.playersHaveSameFaction() || !isLastRoundDraw) {
                    return;
                }

                lastRoundResult.winner = playerId;
            },
        });
    },
    monsters: (game, playerId) => {
        game.onRoundEnd.push({
            once: false,
            run: async () => {
                const units = Object.entries(game.board.getPlayerBoard(playerId))
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
                        game.getPlayerCards(playerId).restore(card);
                        game.board.getRow(row, playerId).add(card);

                        Object.keys(game.players).forEach((id) => game.listeners.notify(id, "monsters"));
                    },
                });
            },
        });
    },
    scoiatael: (game, playerId) => {
        game.onGameStart.push({
            once: true,
            run: async () => {
                if (game.playersHaveSameFaction()) {
                    return;
                }

                game.currentPlayerId = await game.listeners.askStart(playerId);

                Object.keys(game.players).forEach((id) => game.listeners.notify(id, `scoiatael_${game.currentPlayerId === id ? "me" : "op"}`));
            },
        });
    },
    skellige: (game, playerId) => {
        game.onRoundStart.push({
            once: false,
            run: async () => {
                if (game.getRoundCount() !== 3) {
                    return;
                }

                const cards = Cards.getRandom(game.getPlayerCards(playerId)
                    .grave
                    .filter(Cards.isNormalUnit), 2);

                game.getPlayerCards(playerId).restore(...cards);
                cards.forEach((card) => game.playCard(card, playerId));

                Object.keys(game.players).forEach((id) => game.listeners.notify(id, `skellige_${game.currentPlayerId === id ? "me" : "op"}`));
            },
        });
    },
};

export default factions;
