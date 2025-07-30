import type {AbilityId} from "$lib/types/ability";
import type Game from "$lib/server/game";
import type {PlayerIndex} from "$lib/server/types/game";
import type {CardData, UnitRow} from "$lib/types/card";
import type Row from "$lib/server/row";
import Cards from "$lib/server/cards";
import cards from "$lib/cards";

const cancelDiscard = (game: Game, playerIndex: PlayerIndex, name: CardData["name"]): void => {
    game.onRoundStart.push({
        once: true,
        run: () => {
            const {grave} = game.getPlayerCards(playerIndex);
            const index = grave.findIndex((card) => card.name === name);
            if (index === -1) {
                return;
            }

            grave.splice(index, 1);
        },
    });
};

const playLeaderWeather = (game: Game, playerIndex: PlayerIndex, name: CardData["name"]): void => {
    const playerCards = game.getPlayerCards(playerIndex);
    const card = playerCards.deck.find((card) => card.name === name);
    if (!card) {
        return;
    }

    playerCards.drawCard(card);
    game.board.autoplay(card, playerIndex);
};

const playLeaderHorn = (game: Game, playerIndex: PlayerIndex, row: UnitRow): void => {
    if (game.board.getPlayerBoard(playerIndex)[row].special.hasHorn) {
        return;
    }

    game.board.horn(row, playerIndex);
    cancelDiscard(game, playerIndex, "Commander's Horn");
};

const playAvenger = (game: Game, playerIndex: PlayerIndex, name: CardData["name"]): void => {
    const card = cards.find((card) => card.name === name);
    if (!card) {
        return;
    }

    game.board.autoplay(card, playerIndex);
    cancelDiscard(game, playerIndex, name);
};

type Ability = {
    onGameStart?: (game: Game, playerIndex: PlayerIndex) => void;
    onPlaced?: (game: Game, playerIndex: PlayerIndex, row: UnitRow, card: CardData) => void;
    onRemoved?: (game: Game, playerIndex: PlayerIndex, row: UnitRow, card: CardData) => void;
};

const abilities: Partial<Record<AbilityId, Ability>> = {
    mardroeme: {
        onPlaced: (game, playerIndex, row, card) => {
            const playerRow = game.board.getRow(row, playerIndex);
            const berserkers = playerRow
                .getUnits()
                .filter((c) => c.abilities.includes("berserker"));

            berserkers.forEach(() => {
                playerRow.remove(card);
                const transformed = card.name === "Young Berserker" ?
                    cards.find(({name}) => name === "Transformed Young Vildkaarl") :
                    cards.find(({name}) => name === "Transformed Vildkaarl");

                if (!transformed) {
                    return;
                }

                playerRow.add(transformed);
            });
        },
    },
    scorch: {
        onPlaced: (game) => game.scorch(),
    },
    scorch_c: {
        onPlaced: (game, playerIndex) => game.scorch("close", game.getOpponentIndex(playerIndex)),
    },
    scorch_r: {
        onPlaced: (game, playerIndex) => game.scorch("ranged", game.getOpponentIndex(playerIndex)),
    },
    scorch_s: {
        onPlaced: (game, playerIndex) => game.scorch("siege", game.getOpponentIndex(playerIndex)),
    },
    muster: {
        onPlaced: (game, playerIndex, _row, card) => {
            // TODO: refacto
            const i = card.name.indexOf("-");
            const cardName = i === -1 ? card.name : card.name.substring(0, i);
            const predicate = (c: CardData): boolean => c.name.startsWith(cardName);
            const playerCards = game.getPlayerCards(playerIndex);
            const units = playerCards.hand
                .filter(predicate)
                .concat(playerCards.deck
                    .filter(predicate));

            if (units.length === 0) {
                return;
            }

            units.forEach((c) => game.board.autoplay(c, playerIndex));
        },
    },
    spy: {
        onPlaced: (game, playerIndex) => game.getPlayerCards(playerIndex).draw(2),
    },
    medic: {
        onPlaced: async (game, playerIndex) => {
            const playerCards = game.getPlayerCards(playerIndex);
            const units = playerCards.grave.filter(Cards.isUnit);

            if (!units.length) {
                return;
            }

            let card: CardData;
            if (game.getOptions().randomRespawn) {
                [card] = Cards.getRandom(units, 1);
            } else {
                [card] = await game.askSelect(units, playerIndex);
            }

            playerCards.restore(card);
            game.board.autoplay(card, playerIndex);
        },
    },
    avenger: {
        onRemoved: (game, playerIndex) => playAvenger(game, playerIndex, "Bovine Defense Force"),
    },
    avenger_kambi: {
        onRemoved: (game, playerIndex) => playAvenger(game, playerIndex, "Hemdall"),
    },
    foltest_king: {
        onPlaced: (game, playerIndex) => playLeaderWeather(game, playerIndex, "Impenetrable Fog"),
    },
    foltest_lord: {
        onPlaced: (game) => game.board.clearWeather(),
    },
    foltest_siegemaster: {
        onPlaced: (game, playerIndex) => playLeaderHorn(game, playerIndex, "siege"),
    },
    foltest_steelforged: {
        onPlaced: (game, playerIndex) => game.scorch("siege", game.getOpponentIndex(playerIndex)),
    },
    foltest_son: {
        onPlaced: (game, playerIndex) => game.scorch("ranged", game.getOpponentIndex(playerIndex)),
    },
    emhyr_imperial: {
        onPlaced: (game, playerIndex) => playLeaderWeather(game, playerIndex, "Torrential Rain"),
    },
    emhyr_emperor: {
        onPlaced: async (game, playerIndex) => {
            const opponentCards = Cards.getRandom(game.getPlayerCards(game.getOpponentIndex(playerIndex)).hand, 3);
            await game.showCards(opponentCards);
        },
    },
    emhyr_whiteflame: {
        onGameStart: (game) => game.disableLeaders(),
    },
    emhyr_relentless: {
        onPlaced: async (game, playerIndex) => {
            const opponentGrave = game.getPlayerCards(game.getOpponentIndex(playerIndex)).grave;
            const units = opponentGrave.filter(Cards.isUnit);
            if (!units.length) {
                return;
            }

            const [card] = await game.askSelect(units, playerIndex);
            const index = opponentGrave.findIndex(({name}) => name === card.name);
            if (index !== -1) {
                opponentGrave.splice(index, 1);
            }
            game.getPlayerCards(playerIndex).hand.push(card);
        },
    },
    emhyr_invader: {
        onGameStart: (game) => game.enableRandomRespawn(),
    },
    eredin_commander: {
        onPlaced: (game, playerIndex) => playLeaderHorn(game, playerIndex, "close"),
    },
    eredin_bringer_of_death: {
        onPlaced: async (game, playerIndex) => {
            const playerCards = game.getPlayerCards(playerIndex);
            if (!playerCards.grave.length) {
                return;
            }

            const [card] = await game.askSelect(playerCards.grave, playerIndex);
            game.getPlayerCards(playerIndex).restore(card);
        },
    },
    eredin_destroyer: {
        onPlaced: async (game, playerIndex) => {
            const playerCards = game.getPlayerCards(playerIndex);
            const {hand, deck} = playerCards;

            const toDiscard = await game.askSelect(hand, playerIndex, 2);
            playerCards.discard(...toDiscard);

            const [toDraw] = await game.askSelect(deck, playerIndex, 1);
            playerCards.drawCard(toDraw);
        },
    },
    eredin_king: {
        onPlaced: async (game, playerIndex) => {
            const weather = game.getPlayerCards(playerIndex).deck.filter(({deck}) => deck === "weather");
            const [card] = await game.askSelect(weather, playerIndex);
            game.board.autoplay(card, playerIndex);
        },
    },
    eredin_treacherous: {
        onGameStart: (game) => game.enableDoubleSpyPower(),
    },
    francesca_queen: {
        onPlaced: (game, playerIndex) => game.scorch("close", game.getOpponentIndex(playerIndex)),
    },
    francesca_beautiful: {
        onPlaced: (game, playerIndex) => playLeaderHorn(game, playerIndex, "ranged"),
    },
    francesca_daisy: {
        onGameStart: (game, playerIndex) => game.getPlayerCards(playerIndex).draw(),
    },
    francesca_pureblood: {
        onPlaced: (game, playerIndex) => {
            const card = game.getPlayerCards(playerIndex).deck.find(({name}) => name === "Biting Frost");
            if (!card) {
                return;
            }

            game.board.addWeather(card);
        },
    },
    francesca_hope: {
        onPlaced: (game, playerIndex) => {
            const close = game.board.getRow("close", playerIndex);
            const ranged = game.board.getRow("ranged", playerIndex);

            const moveCards = (from: Row, to: Row): void => from
                .getUnits()
                .filter((card) => card.row === "agile" && to.getCardScore(card) > from.getCardScore(card))
                .forEach((card) => {
                    from.remove(card);
                    to.add(card);
                });

            moveCards(close, ranged);
            moveCards(ranged, close);
        },
    },
    crach_an_craite: {
        onPlaced: (game) => game.players.forEach((player) => {
            player.cards.deck = Cards.shuffle([...player.cards.deck, ...player.cards.grave]);
            player.cards.grave = [];
        }),
    },
    king_bran: {
        onGameStart: (game) => game.enableHalfWeather(),
    },
};

export default abilities;
