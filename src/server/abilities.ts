import type Game from "./game.js";
import Cards from "./cards.js";
import type Row from "./row.js";
import cards from "@shared/cards.js";
import type {PlayerId} from "./types/game.js";
import type {AbilityId} from "@shared/types/ability.js";
import type {CardData, UnitRow} from "@shared/types/card.js";

const cancelDiscard = (game: Game, playerId: PlayerId, filename: CardData["filename"]): void => {
    game.onRoundStart.push({
        once: true,
        run: async () => {
            const {grave} = game.getPlayerCards(playerId);
            const index = grave.findIndex((card) => card.filename === filename);
            if (index === -1) {
                return;
            }

            grave.splice(index, 1);
        },
    });
};

const playLeaderWeather = (game: Game, playerId: PlayerId, name: CardData["name"]): void => {
    const playerCards = game.getPlayerCards(playerId);
    const card = playerCards.deck.find((card) => card.name === name);
    if (!card) {
        return;
    }

    playerCards.drawCard(card);
    game.playCard(card, playerId);
};

const playLeaderHorn = (game: Game, playerId: PlayerId, row: UnitRow): void => {
    if (game.board.getPlayerBoard(playerId)[row].special.some(({abilities}) => abilities.includes("horn"))) {
        return;
    }

    const horn = cards["horn"];
    if (horn?.type !== "special") {
        throw new Error("could not find horn");
    }

    game.board.playSpecial(horn, playerId, row);
    cancelDiscard(game, playerId, "horn");
};

const playAvenger = (game: Game, playerId: PlayerId, filename: CardData["filename"]): void => {
    const card = cards[filename];
    if (!card) {
        return;
    }

    game.onRoundStart.push({
        once: true,
        run: async () => {
            await game.playCard(card, playerId);
            cancelDiscard(game, playerId, filename);
        },
    });
};

type Ability = {
    onGameStart?: (game: Game, playerId: PlayerId) => void;
    onPlaced?: (game: Game, playerId: PlayerId, row: UnitRow|null, card: CardData) => Promise<void>;
    onRemoved?: (game: Game, playerId: PlayerId, row: UnitRow|null, card: CardData) => void;
};

const abilities: Partial<Record<AbilityId, Ability>> = {
    mardroeme: {
        onPlaced: async (game, playerId, row, card) => {
            if (!row) {
                throw new Error("mardroeme must be placed on a unit row");
            }
            if (card.type !== "unit") {
                throw new Error("played card must be a unit");
            }

            const playerRow = game.board.getRow(row, playerId);
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
        onPlaced: async (game, playerId, row) => {
            if (!row) {
                throw new Error("decoy must be placed on a unit row");
            }

            const playerRow = game.board.getRow(row, playerId);
            // TODO filter heros ?
            const units = playerRow
                .getUnits()
                .filter((card) => !card.abilities.includes("hero") && !card.abilities.includes("decoy"));

            if (!units.length) {
                return;
            }

            const {item} = await game.listeners.selectCard(playerId, units, false);
            if (item.type !== "unit") {
                return;
            }

            playerRow.remove(item);
            game.getPlayerCards(playerId).hand.push(item);
        },
    },
    scorch: {
        onPlaced: async (game) => game.scorch(),
    },
    scorch_c: {
        onPlaced: async (game, playerId) => game.scorch("close", game.getOpponentId(playerId), 10),
    },
    scorch_r: {
        onPlaced: async (game, playerId) => game.scorch("ranged", game.getOpponentId(playerId), 10),
    },
    scorch_s: {
        onPlaced: async (game, playerId) => game.scorch("siege", game.getOpponentId(playerId), 10),
    },
    muster: {
        onPlaced: async (game, playerId, _, card) => {
            // TODO: refacto
            const i = card.name.indexOf("-");
            const cardName = i === -1 ? card.name : card.name.substring(0, i);
            const predicate = (c: CardData): boolean => c.name.startsWith(cardName);
            const playerCards = game.getPlayerCards(playerId);

            playerCards.drawCard(...playerCards.deck.filter(predicate));

            let unit: CardData;
            while (unit = playerCards.hand.find(predicate)) {
                game.playCard(unit, playerId);
            }
        },
    },
    spy: {
        onPlaced: async (game, playerId) => game.getPlayerCards(playerId).draw(2),
    },
    medic: {
        onPlaced: async (game, playerId) => {
            const playerCards = game.getPlayerCards(playerId);
            const units = playerCards.grave.filter(Cards.isNormalUnit);

            if (!units.length) {
                return;
            }

            let card: CardData;
            if (game.getOptions().randomRespawn) {
                [card] = Cards.getRandom(units, 1);
            } else {
                const {item} = await game.listeners.selectCard(playerId, units, false);
                card = item;
            }

            playerCards.restore(card);
            game.playCard(card, playerId);
        },
    },
    avenger: {
        onRemoved: async (game, playerId) => playAvenger(game, playerId, "chort"),
    },
    avenger_kambi: {
        onRemoved: async (game, playerId) => playAvenger(game, playerId, "hemdall"),
    },
    foltest_king: {
        onPlaced: async (game, playerId) => playLeaderWeather(game, playerId, "Impenetrable Fog"),
    },
    foltest_lord: {
        onPlaced: async (game) => {
            game.board.clearWeather();
        },
    },
    foltest_siegemaster: {
        onPlaced: async (game, playerId) => playLeaderHorn(game, playerId, "siege"),
    },
    foltest_steelforged: {
        onPlaced: async (game, playerId) => game.scorch("siege", game.getOpponentId(playerId), 10),
    },
    foltest_son: {
        onPlaced: async (game, playerId) => game.scorch("ranged", game.getOpponentId(playerId), 10),
    },
    emhyr_imperial: {
        onPlaced: async (game, playerId) => playLeaderWeather(game, playerId, "Torrential Rain"),
    },
    emhyr_emperor: {
        onPlaced: async (game, playerId) => {
            const opponentCards = Cards.getRandom(game.getPlayerCards(game.getOpponentId(playerId)).hand, 3);
            await game.listeners.showCards(playerId, opponentCards);
        },
    },
    emhyr_whiteflame: {
        onGameStart: (game) => game.disableLeaders(),
    },
    emhyr_relentless: {
        onPlaced: async (game, playerId) => {
            const opponentGrave = game.getPlayerCards(game.getOpponentId(playerId)).grave;
            const units = opponentGrave.filter(Cards.isNormalUnit);
            if (!units.length) {
                return;
            }

            const {item} = await game.listeners.selectCard(playerId, units, false);
            const index = opponentGrave.findIndex(({filename}) => filename === item.filename);
            if (index !== -1) {
                opponentGrave.splice(index, 1);
            }
            game.getPlayerCards(playerId).hand.push(item);
        },
    },
    emhyr_invader: {
        onGameStart: (game) => game.enableRandomRespawn(),
    },
    eredin_commander: {
        onPlaced: async (game, playerId) => playLeaderHorn(game, playerId, "close"),
    },
    eredin_bringer_of_death: {
        onPlaced: async (game, playerId) => {
            const {grave} = game.getPlayerCards(playerId);
            if (!grave.length) {
                return;
            }

            const {item} = await game.listeners.selectCard(playerId, grave, false);
            game.getPlayerCards(playerId).restore(item);
        },
    },
    eredin_destroyer: {
        onPlaced: async (game, playerId) => {
            const playerCards = game.getPlayerCards(playerId);
            const {hand, deck} = playerCards;

            let startIndex = 0;
            for (let i = 0; i < 2; ++i) {
                const {item: toDiscard, index} = await game.listeners.selectCard(playerId, hand, false, startIndex);
                playerCards.discard(toDiscard);
                startIndex = Math.max(index, hand.length - 1);
            }

            const {item: toDraw} = await game.listeners.selectCard(playerId, deck, false);
            playerCards.drawCard(toDraw);
        },
    },
    eredin_king: {
        onPlaced: async (game, playerId) => {
            const weather = game.getPlayerCards(playerId).deck.filter(({type}) => type === "weather");
            const {item} = await game.listeners.selectCard(playerId, weather, false);
            game.playCard(item, playerId);
        },
    },
    eredin_treacherous: {
        onGameStart: (game) => game.enableDoubleSpyPower(),
    },
    francesca_queen: {
        onPlaced: async (game, playerId) => game.scorch("close", game.getOpponentId(playerId), 10),
    },
    francesca_beautiful: {
        onPlaced: async (game, playerId) => playLeaderHorn(game, playerId, "ranged"),
    },
    francesca_daisy: {
        onGameStart: (game, playerId) => game.getPlayerCards(playerId).draw(),
    },
    francesca_pureblood: {
        onPlaced: async (game, playerId) => {
            const card = game.getPlayerCards(playerId).deck.find(({filename}) => filename === "frost");
            if (!card || card.type !== "weather") {
                return;
            }

            game.board.playWeather(card, playerId);
        },
    },
    francesca_hope: {
        onPlaced: async (game, playerId) => {
            const close = game.board.getRow("close", playerId);
            const ranged = game.board.getRow("ranged", playerId);

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
        onPlaced: async (game) => Object.values(game.players).forEach((player) => {
            player.cards.deck = Cards.shuffle([...player.cards.deck, ...player.cards.grave]);
            player.cards.grave = [];
        }),
    },
    king_bran: {
        onGameStart: (game) => game.enableHalfWeather(),
    },
};

export default abilities;
