const onGameStart = [];
const onTurnStart = [];
const onTurnEnd = [];
const onRoundStart = [];
const onRoundEnd = [];

// Sets up player faction abilities and psasive leader abilities
const initPlayers = (p1, p2) => {
    let l1 = ability_dict[p1.leader.abilities[0]];
    let l2 = ability_dict[p2.leader.abilities[0]];

    if (l1.placed) l1.placed();
    if (l2.placed) l2.placed();

    factions[player.deck.faction].factionAbility(p1);
    factions[player.deck.faction].factionAbility(p2);
}

// Sets initializes player abilities, player hands and redraw
const startGame = () => {
    initPlayers(player_me, player_op);
    for (let i = 0; i < 10; ++i) {
        player_me.deck.draw(player_me.hand);
        player_op.deck.draw(player_op.hand);
    }

    runEffects(onGameStart);
    if (!firstPlayer)
        firstPlayer = coinToss();

    initialRedraw();
};

const coinToss = () => {
    return (Math.random() < 0.5) ? player_me : player_op;
}

const initialRedraw = () => {
    player_me.redraw(2);
    player_op.redraw(2);
    // player_me.deck.swap(c, c.removeCard(i);

    startRound();
}

// Initiates a new round of the game
const startRound = () => {
    roundCount++;
    this.currPlayer = (this.roundCount % 2 === 0) ? this.firstPlayer : this.firstPlayer.opponent();
    runEffects(onRoundStart);

    if (!player_me.canPlay())
        player_me.setPassed(true);
    if (!player_op.canPlay())
        player_op.setPassed(true);

    if (player_op.passed && player_me.passed)
        return this.endRound();

    if (this.currPlayer.passed)
        this.currPlayer = this.currPlayer.opponent();

    await ui.notification("round-start", 1200);
    if (this.currPlayer.opponent().passed)
        await ui.notification(this.currPlayer.tag + "-turn", 1200);

    this.startTurn();
}

    // Starts a new turn. Enables client interraction in client's turn.
    async startTurn() {
        await this.runEffects(this.turnStart);
        if (!this.currPlayer.opponent().passed) {
            this.currPlayer = this.currPlayer.opponent();
            await ui.notification(this.currPlayer.tag + "-turn", 1200);
        }
        ui.enablePlayer(this.currPlayer === player_me);
        this.currPlayer.startTurn();
    }

    // Ends the current turn and may end round. Disables client interraction in client's turn.
    async endTurn() {
        if (this.currPlayer === player_me)
            ui.enablePlayer(false);
        await this.runEffects(this.turnEnd);
        if (this.currPlayer.passed)
            await ui.notification(this.currPlayer.tag + "-pass", 1200);
        if (player_op.passed && player_me.passed)
            this.endRound();
        else
            this.startTurn();
    }

    // Ends the round and may end the game. Determines final scores and the round winner.
    async endRound() {
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
        this.roundHistory.push(verdict);

        await this.runEffects(this.roundEnd);

        board.row.forEach(row => row.clear());
        weather.clearWeather();

        player_me.endRound(dif > 0);
        player_op.endRound(dif < 0);

        if (dif > 0)
            await ui.notification("win-round", 1200);
        else if (dif < 0)
            await ui.notification("lose-round", 1200);
        else
            await ui.notification("draw-round", 1200);

        if (player_me.health === 0 || player_op.health === 0)
            this.endGame();
        else
            this.startRound();
    }

const endGame = () => {
    // roundHistory
    if (player_op.health <= 0 && player_me.health <= 0) {
        // draw
    } else if (player_op.health === 0) {
        // win
    } else {
        // lose
    }
}
