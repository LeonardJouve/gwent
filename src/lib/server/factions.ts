import type {FactionName} from "$lib/types/faction";

const factions: Record<FactionName, () => void> = {
    realms: () => {
        game.roundStart.push(async () => {
            if (game.roundCount > 1 && game.roundHistory[game.roundCount - 2].winner === player) {
                player.deck.draw(player.hand);
                await ui.notification("north", 1200);
            }
            return false;
        });
    },
    nilfgaard: () => {
        game.roundEnd(() => {
            if (draw) {
                winner = player;
            }
        });
    },
    monsters: () => {
        game.roundEnd.push(() => {
            let units = board.row.filter((r, i) => player === player_me ^ i < 3)
                .reduce((a, r) => r.cards.filter(c => c.isUnit()).concat(a), []);
            if (units.length === 0)
                return;
            let card = units[randomInt(units.length)];
            card.noRemove = true;
            game.roundStart.push(async () => {
                await ui.notification("monsters", 1200);
                delete card.noRemove;
                return true;
            });
            return false;
        });
    },
    scoiatael: () => {
        game.gameStart.push(async () => {
            let notif = "";
            if (p1.deck.faction === p2.deck.faction) return;
            if (player === player_me) {
                await ui.popup("Go First", () => game.firstPlayer = player, "Let Opponent Start", () => game.firstPlayer = player.opponent(), "Would you like to go first?", "The Scoia'tael faction perk allows you to decide who will get to go first.");
                notif = game.firstPlayer.tag + "-first";
            } else if (player.hand instanceof HandAI) {
                if (Math.random() < 0.5) {
                    game.firstPlayer = player;
                    notif = "scoiatael";
                } else {
                    game.firstPlayer = player.opponent();
                    notif = game.firstPlayer.tag + "-first";
                }
            } else {
                //sleepUntil(game.firstPlayer); //TODO online
            }
            await ui.notification(notif, 1200);
            return true;
        });
    },
    skellige: () => {
        game.roundStart.push(async () => {
            if (game.roundCount != 3)
                return false;
            await ui.notification("skellige-" + player.tag, 1200);
            await Promise.all(player.grave.findCardsRandom(c => c.isUnit(), 2).map(c => board.toRow(c, player.grave)));
            return true;
        });
    },
};

export default factions;
