import type Game from "./game.js";
import Cards from "./cards.js";
import type Row from "./row.js";
import cards from "@shared/cards.js";
import type {PlayerIndex} from "./types/game.js";
import type {AbilityId} from "@shared/types/ability.js";
import type {CardData, UnitRow} from "@shared/types/card.js";

const cancelDiscard = (game: Game, playerIndex: PlayerIndex, filename: CardData["filename"]): void => {
    game.onRoundStart.push({
        once: true,
        run: async () => {
            const {grave} = game.getPlayerCards(playerIndex);
            const index = grave.findIndex((card) => card.filename === filename);
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
    game.playCard(card, playerIndex);
};

const playLeaderHorn = (game: Game, playerIndex: PlayerIndex, row: UnitRow): void => {
    if (game.board.getPlayerBoard(playerIndex)[row].special.some(({abilities}) => abilities.includes("horn"))) {
        return;
    }

    const horn = cards["horn"];
    if (horn?.type !== "special") {
        throw new Error("could not find horn");
    }

    game.board.playSpecial(horn, playerIndex, row);
    cancelDiscard(game, playerIndex, "horn");
};

const playAvenger = (game: Game, playerIndex: PlayerIndex, filename: CardData["filename"]): void => {
    const card = cards[filename];
    if (!card) {
        return;
    }

    game.playCard(card, playerIndex);
    cancelDiscard(game, playerIndex, filename);
};

type Ability = {
    onGameStart?: (game: Game, playerIndex: PlayerIndex) => void;
    onPlaced?: (game: Game, playerIndex: PlayerIndex, row: UnitRow|null, card: CardData) => Promise<void>;
    onRemoved?: (game: Game, playerIndex: PlayerIndex, row: UnitRow|null, card: CardData) => void;
};

const abilities: Partial<Record<AbilityId, Ability>> = {
    mardroeme: {
        onPlaced: async (game, playerIndex, row, card) => {
            if (!row) {
                throw new Error("mardroeme must be placed on a unit row");
            }
            if (card.type !== "unit") {
                throw new Error("played card must be a unit");
            }

            const playerRow = game.board.getRow(row, playerIndex);
            const berserkers = playerRow
                .getUnits()
                .filter((c) => c.abilities.includes("berserker"));

            berserkers.forEach(() => {
                playerRow.remove(card);
                const transformed = card.name === "Young Berserker" ?
                    cards["young_vildkaarl"] :
                    cards["vildkaarl"];

                if (transformed?.type !== "unit") {
                    return;
                }

                playerRow.add(transformed);
            });
        },
    },
    decoy: {
        onPlaced: async (game, playerIndex, row) => {
            if (!row) {
                throw new Error("decoy must be placed on a unit row");
            }

            const playerRow = game.board.getRow(row, playerIndex);
            // TODO filter heros ?
            const units = playerRow
                .getUnits()
                .filter((card) => !card.abilities.includes("hero") && !card.abilities.includes("decoy"));

            const [card] = await game.listeners.selectCards(playerIndex, units, 1, false);
            if (card.type !== "unit") {
                return;
            }

            playerRow.remove(card);
            game.getPlayerCards(playerIndex).hand.push(card);
        },
    },
    scorch: {
        onPlaced: async (game) => game.scorch(),
    },
    scorch_c: {
        onPlaced: async (game, playerIndex) => game.scorch("close", game.getOpponentIndex(playerIndex)),
    },
    scorch_r: {
        onPlaced: async (game, playerIndex) => game.scorch("ranged", game.getOpponentIndex(playerIndex)),
    },
    scorch_s: {
        onPlaced: async (game, playerIndex) => game.scorch("siege", game.getOpponentIndex(playerIndex)),
    },
    muster: {
        onPlaced: async (game, playerIndex, _, card) => {
            // TODO: refacto
            const i = card.name.indexOf("-");
            const cardName = i === -1 ? card.name : card.name.substring(0, i);
            const predicate = (c: CardData): boolean => c.name.startsWith(cardName);
            const playerCards = game.getPlayerCards(playerIndex);

            playerCards.drawCard(...playerCards.deck.filter(predicate));

            let unit: CardData;
            while (unit = playerCards.hand.find(predicate)) {
                game.playCard(unit, playerIndex);
            }
        },
    },
    spy: {
        onPlaced: async (game, playerIndex) => game.getPlayerCards(playerIndex).draw(2),
    },
    medic: {
        onPlaced: async (game, playerIndex) => {
            const playerCards = game.getPlayerCards(playerIndex);
            const units = playerCards.grave.filter(Cards.isNormalUnit);

            if (!units.length) {
                return;
            }

            let card: CardData;
            if (game.getOptions().randomRespawn) {
                [card] = Cards.getRandom(units, 1);
            } else {
                [card] = await game.listeners.selectCards(playerIndex, units, 1, false);
            }

            playerCards.restore(card);
            game.playCard(card, playerIndex);
        },
    },
    avenger: {
        onRemoved: async (game, playerIndex) => playAvenger(game, playerIndex, "chort"),
    },
    avenger_kambi: {
        onRemoved: async (game, playerIndex) => playAvenger(game, playerIndex, "hemdall"),
    },
    foltest_king: {
        onPlaced: async (game, playerIndex) => playLeaderWeather(game, playerIndex, "Impenetrable Fog"),
    },
    foltest_lord: {
        onPlaced: async (game) => {
            game.board.clearWeather();
        },
    },
    foltest_siegemaster: {
        onPlaced: async (game, playerIndex) => playLeaderHorn(game, playerIndex, "siege"),
    },
    foltest_steelforged: {
        onPlaced: async (game, playerIndex) => game.scorch("siege", game.getOpponentIndex(playerIndex)),
    },
    foltest_son: {
        onPlaced: async (game, playerIndex) => game.scorch("ranged", game.getOpponentIndex(playerIndex)),
    },
    emhyr_imperial: {
        onPlaced: async (game, playerIndex) => playLeaderWeather(game, playerIndex, "Torrential Rain"),
    },
    emhyr_emperor: {
        onPlaced: async (game, playerIndex) => {
            const opponentCards = Cards.getRandom(game.getPlayerCards(game.getOpponentIndex(playerIndex)).hand, 3);
            await game.listeners.showCards(playerIndex, opponentCards);
        },
    },
    emhyr_whiteflame: {
        onGameStart: (game) => game.disableLeaders(),
    },
    emhyr_relentless: {
        onPlaced: async (game, playerIndex) => {
            const opponentGrave = game.getPlayerCards(game.getOpponentIndex(playerIndex)).grave;
            const units = opponentGrave.filter(Cards.isNormalUnit);
            if (!units.length) {
                return;
            }

            const [card] = await game.listeners.selectCards(playerIndex, units, 1, false);
            const index = opponentGrave.findIndex(({filename}) => filename === card.filename);
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
        onPlaced: async (game, playerIndex) => playLeaderHorn(game, playerIndex, "close"),
    },
    eredin_bringer_of_death: {
        onPlaced: async (game, playerIndex) => {
            const playerCards = game.getPlayerCards(playerIndex);
            if (!playerCards.grave.length) {
                return;
            }

            const [card] = await game.listeners.selectCards(playerIndex, playerCards.grave, 1, false);
            game.getPlayerCards(playerIndex).restore(card);
        },
    },
    eredin_destroyer: {
        onPlaced: async (game, playerIndex) => {
            const playerCards = game.getPlayerCards(playerIndex);
            const {hand, deck} = playerCards;

            const toDiscard = await game.listeners.selectCards(playerIndex, hand, 2, false);
            playerCards.discard(...toDiscard);

            const [toDraw] = await game.listeners.selectCards(playerIndex, deck, 1, false);
            playerCards.drawCard(toDraw);
        },
    },
    eredin_king: {
        onPlaced: async (game, playerIndex) => {
            const weather = game.getPlayerCards(playerIndex).deck.filter(({type}) => type === "weather");
            const [card] = await game.listeners.selectCards(playerIndex, weather, 1, false);
            game.playCard(card, playerIndex);
        },
    },
    eredin_treacherous: {
        onGameStart: (game) => game.enableDoubleSpyPower(),
    },
    francesca_queen: {
        onPlaced: async (game, playerIndex) => game.scorch("close", game.getOpponentIndex(playerIndex)),
    },
    francesca_beautiful: {
        onPlaced: async (game, playerIndex) => playLeaderHorn(game, playerIndex, "ranged"),
    },
    francesca_daisy: {
        onGameStart: (game, playerIndex) => game.getPlayerCards(playerIndex).draw(),
    },
    francesca_pureblood: {
        onPlaced: async (game, playerIndex) => {
            const card = game.getPlayerCards(playerIndex).deck.find(({filename}) => filename === "frost");
            if (!card || card.type !== "weather") {
                return;
            }

            game.board.playWeather(card, playerIndex);
        },
    },
    francesca_hope: {
        onPlaced: async (game, playerIndex) => {
            const close = game.board.getRow("close", playerIndex);
            const ranged = game.board.getRow("ranged", playerIndex);

            const moveCards = (from: Row, to: Row): void => from
                .getUnits()
                .filter((card) => card.abilities.includes("agile") && to.getCardScore(card) > from.getCardScore(card))
                .forEach((card) => {
                    from.remove(card);
                    to.add(card);
                });

            moveCards(close, ranged);
            moveCards(ranged, close);
        },
    },
    crach_an_craite: {
        onPlaced: async (game) => game.players.forEach((player) => {
            player.cards.deck = Cards.shuffle([...player.cards.deck, ...player.cards.grave]);
            player.cards.grave = [];
        }),
    },
    king_bran: {
        onGameStart: (game) => game.enableHalfWeather(),
    },
};

export default abilities;
