import abilities from "$lib/abilities";
import factions from "$lib/factions";
import type {CardData} from "$lib/types/card";
import type {FactionName} from "$lib/types/faction";

const onGameStart = [];
const onTurnStart = [];
const onTurnEnd = [];
const onRoundStart = [];
const onRoundEnd = [];

let currentPlayerIndex = 0;
let roundCount = 0;

type Player = {
    faction: FactionName;
    leader: CardData;
    // name: string;
    // cards: CardData[];
    // isLeaderAvailable: boolean;
    // hand: CardData[];
    // grave: CardData[];
    // gems: number;
    // board: Record<UnitRow, Row>;
};

const players: Player[] = [];

// Sets initializes player abilities, player hands and redraw
const startGame = () => {
    players.forEach((player) => {
        player.leader.abilities.forEach((ability) => {
            abilities[ability].onGameStart?.(player);
        });
        factions[player.faction].factionAbility(player);

        player.deck.draw(10);
    });

    runEffects(onGameStart);
    if (!firstPlayer) {
        firstPlayer = coinToss();
    }

    player_me.redraw(2);
    player_op.redraw(2);
    // player_me.deck.swap(c, c.removeCard(i));

    startRound();
};

const coinToss = () => (Math.random() < 0.5) ? player_me : player_op;

const nextPlayer = () => currentPlayerIndex = getOpponentIndex(currentPlayerIndex);

const getOpponentIndex = (playerIndex: number) => (playerIndex + 1) % players.length;

// Initiates a new round of the game
const startRound = () => {
    ++roundCount;
    currentPlayerIndex = (roundCount % 2 === 0) ? firstPlayer : getOpponentIndex(firstPlayer);
    runEffects(onRoundStart);

    if (!player_me.canPlay())
        player_me.setPassed(true);
    if (!player_op.canPlay())
        player_op.setPassed(true);

    if (player_op.hasPassed && player_me.hasPassed)
        return endRound();

    if (players[currentPlayerIndex].hasPassed)
        nextPlayer();

    startTurn();
}

startTurn() {
    runEffects(onTurnStart);
}

endTurn() {
    runEffects(onTurnEnd);
    if (player_op.passed && player_me.passed) {
        endRound();
    }
    else {
        startTurn();
    }
}

endRound() {
    let dif = player_me.total - player_op.total;
    if (dif === 0) {
        let nilf_me = player_me.deck.faction === "nilfgaard",
            nilf_op = player_op.deck.faction === "nilfgaard";
        dif = nilf_me ^ nilf_op ? nilf_me ? 1 : -1 : 0;
    }
    let winner = dif > 0 ? player_me : dif < 0 ? player_op : null;
    let verdict = {
        winner: winner,
        score_me: player_me.total,
        score_op: player_op.total
    }
    roundHistory.push(verdict);

    runEffects(onRoundEnd);

    board.row.forEach(row => row.clear());
    weather.clear();

    if (player_me.health === 0 || player_op.health === 0)
        endGame();
    else
        startRound();
}

const endGame = () => {
    // roundHistory
    if (player_op.health === 0 && player_me.health === 0) {
        // draw
    } else if (player_op.health === 0) {
        // win
    } else {
        // lose
    }
}
