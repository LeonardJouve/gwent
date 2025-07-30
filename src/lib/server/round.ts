import abilities from "$lib/abilities";
import factions from "$lib/factions";
import type {CardData} from "$lib/types/card";
import type {FactionName} from "$lib/types/faction";

type PlayerIndex = number;

type RoundHistory = {
    winner: PlayerIndex;
    scores: [number, number];
};

type Effect = {
    once: boolean;
    run: () => void;
};

type Player = {
    faction: FactionName;
    leader: CardData;
    name: string;
    cards: CardData[];
    isLeaderAvailable: boolean;
    hand: CardData[];
    deck: CardData[];
    grave: CardData[];
    gems: number;
};

const players: Player[] = [];
const onGameStart: Effect[] = [];
const onRoundStart: Effect[] = [];
const onRoundEnd: Effect[] = [];
const roundHistories: RoundHistory[] = [];
let currentPlayerIndex: PlayerIndex = 0;

const runEffects = (effects: Effect[]): Effect[] => effects.filter(({run, once}) => {
    run();
    return !once;
});

const startGame = (): void => {
    players.forEach((player) => {
        player.leader.abilities.forEach((ability) => {
            abilities[ability].onGameStart?.(player);
        });
        factions[player.faction](player);

        player.deck.draw(10);
    });

    runEffects(onGameStart);
    if (!currentPlayerIndex) {
        currentPlayerIndex = coinToss();
    }

    players.forEach((player) => player.hand.redraw(2));
    // player_me.deck.swap(c, c.removeCard(i));

    startRound();
};


const nextPlayer = (): void => {
    currentPlayerIndex = getOpponentIndex(currentPlayerIndex);
};

const getOpponentIndex = (playerIndex: number): PlayerIndex => (playerIndex + 1) % players.length;

// Initiates a new round of the game
const startRound = (): void => {
    if (roundHistories.length) {
        currentPlayerIndex = roundHistories[roundHistories.length - 1].winner;
    }

    runEffects(onRoundStart);


    if (players.every(({hasPassed}) => hasPassed)) {
        return endRound();
    }

    startTurn();
};

const startTurn = (): void => {
    if (!player.canPlay()) {
        player.hasPassed = true;
        endTurn();
    }

    // pass / play card / activate leader -> endTurn
};

const endTurn = (): void => {
    if (players.every(({hasPassed}) => hasPassed)) {
        endRound();
    } else {
        nextPlayer();
        startTurn();
    }
};

const endRound = (): void => {
    const scores = players.map(({total}) => total);

    let dif = player_me.total - player_op.total;
    if (dif === 0) {
        const nilf_me = player_me.deck.faction === "nilfgaard",
            nilf_op = player_op.deck.faction === "nilfgaard";
        dif = nilf_me ^ nilf_op ? nilf_me ? 1 : -1 : 0;
    }
    const winner = dif > 0 ? player_me : dif < 0 ? player_op : null;

    roundHistories.push({
        winner,
        scores,
    });

    runEffects(onRoundEnd);

    game.clear();

    if (players.some(({gems}) => !gems)) {
        endGame();
    } else {
        startRound();
    }
};

const endGame = (): void => {
    // send result and roundHistories
    // draw
    // win
    // lose
};
