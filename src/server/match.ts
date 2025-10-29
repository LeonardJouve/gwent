import Game from "./game.js";
import Listeners from "./listeners.js";
import Cards from "./cards.js";
import {deserialize} from "@shared/cards.js";
import type {PlayerId, RoundResult} from "./types/game.js";
import type {CardData} from "@shared/types/card.js";
import type {NotificationName} from "@shared/types/notification.js";
import type {CardSelection, ServerSideSocket} from "@shared/types/socket.js";
import type {Play, State} from "@shared/types/game.js";
import type {PlayerIndicator} from "@shared/types/player.js";
import type {RoundResult as SocketRoundResult} from "@shared/types/game.js";
import type {Matchmake} from "@shared/types/matchmake.js";

export default class Match implements Listeners {
    static matches = new Map<string, Match>();
    public id: string;
    private sockets: Record<PlayerId, ServerSideSocket|null>;
    private game: Game;

    constructor(playerDatas: Record<PlayerId, Matchmake>) {
        const playerIds = Object.keys(playerDatas)
        if (playerIds.length !== 2) {
            throw new Error("invalid player amount");
        }

        this.game = new Game(this, Object.fromEntries(Object.entries(playerDatas).map(([id, {deck, ...player}]) => [id, {
            ...player,
            leader: deck.leader,
            cards: new Cards(deck.cards),
            isLeaderAvailable: true,
            gems: 2,
            hasPassed: false,
        }])));

        this.id = crypto.randomUUID();
        this.sockets = Object.fromEntries(playerIds.map((id) => [id, null]));
    }

    join(socket: ServerSideSocket): boolean {
        const {id} = socket.data;
        if (this.sockets[id] !== null) {
            return false;
        }

        this.sockets[id] = socket;

        this.tryStartMatch();

        return true;
    }

    handleDisconnect(playerId: PlayerId): void {
        // TODO stop game
        const otherPlayer = this.game.getOpponentId(playerId);
        this.notify(otherPlayer, "player_left");
        this.showResults(otherPlayer, [], otherPlayer);
    }

    private async tryStartMatch(): Promise<void> {
        if (Object.values(this.sockets).some((socket) => !socket)) {
            return;
        }

        Object.entries(this.sockets)
            .forEach(([id, socket]) => socket.on("disconnect", () => this.handleDisconnect(id)));

        await this.game.playGame();
    }

    private remove(): void {
        Match.matches.delete(this.id);
    }

    async askStart(playerId: PlayerId): Promise<PlayerId> {
        const player = await new Promise<PlayerIndicator>((resolve) => this.sockets[playerId].emit("ask_start", resolve));
        return player === "me" ? playerId : this.game.getOpponentId(playerId);
    }

    selectCard(playerId: PlayerId, cards: CardData[], isClosable: boolean, startIndex = 0): Promise<CardSelection|null> {
        return new Promise<CardSelection|null>((resolve) => this.sockets[playerId].emit("select_card", cards, isClosable, startIndex, (selection) => resolve(selection ? {
            item: deserialize(selection.item),
            index: selection.index,
        } : null)));
    }

    showCards(playerId: PlayerId, cards: CardData[]): Promise<void> {
        return new Promise<void>((resolve) => this.sockets[playerId].emit("show_cards", cards, resolve));
    }

    notify(playerId: PlayerId, name: NotificationName): void {
        this.sockets[playerId].emit("notify", name);
    }

    showResults(playerId: PlayerId, results: RoundResult[], winner: PlayerId|null): void {
        const winnerIndicator = winner === null ?
            null :
            winner === playerId ?
                "me" :
                "opponent";

        const socketResults = results.map<SocketRoundResult>((result) => ({
            winner: result.winner === playerId ? "me" : "opponent",
            scores: Object.fromEntries(Object.entries(result.scores)
                .map(([id, score]) => [id === playerId ? "me" : "opponent", score])) as Record<PlayerIndicator, number>,
        }));

        this.sockets[playerId].emit("show_results", socketResults, winnerIndicator);

        this.remove();
    }

    askPlay(playerId: PlayerId): Promise<Play> {
        return new Promise<Play>((resolve) => this.sockets[playerId].emit("ask_play", resolve));
    }

    sendState(playerId: PlayerId, state: State): void {
        this.sockets[playerId].emit("send_state", state);
    }
}
