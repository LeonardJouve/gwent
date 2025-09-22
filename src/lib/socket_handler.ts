import {io} from "socket.io-client";
import type {SocketData, ClientSideSocket} from "@shared/types/socket";
import {PUBLIC_API_SERVER_URL} from "$env/static/public";
import type {Play, State} from "@shared/types/game";
import {store as gameStore} from "./store/game.svelte";
import {store as notificationStore} from "./store/notifications.svelte";
import {store as carouselStore} from "./store/carousel.svelte";
import type {RoundResult} from "../../server/types/game";
import type {CardData} from "@shared/types/card";
import type {NotificationName} from "@shared/types/notification";
import type {PlayerIndicator} from "@shared/types/player";

export class SocketHandler {
    private socketData: SocketData;
    private socket: ClientSideSocket;

    constructor(socketData: SocketData) {
        this.socketData = socketData;
        this.socket = io(PUBLIC_API_SERVER_URL);

        this.handle();
    }

    handle(): void {
        this.socket.on("get_data", this.handleGetData.bind(this));
        this.socket.on("send_state", SocketHandler.handleSendState);
        this.socket.on("ask_start", SocketHandler.handleAskStart);
        this.socket.on("ask_play", SocketHandler.handleAskPlay);
        this.socket.on("select_cards", SocketHandler.handleSelectCards);
        this.socket.on("notify", SocketHandler.handleNotify);
        this.socket.on("show_cards", SocketHandler.handleShowCards);
        this.socket.on("show_results", SocketHandler.handleShowResults);
    }

    handleGetData(callback: (data: SocketData) => void): void {
        callback(this.socketData);
    }

    static handleSendState({turn, players, board}: State): void {
        gameStore.turn = turn;
        gameStore.players = {...players};
        gameStore.board = board;
    }

    static handleAskStart(callback: (player: PlayerIndicator) => void): void {
        // TODO
        callback("me");
    }

    static handleAskPlay(callback: (play: Play) => void): void {
        // TODO
    }

    static handleSelectCards(cards: CardData[], amount: number, callback: (cards: CardData[]) => void): void {
        // TODO
        carouselStore.amount = amount;
        carouselStore.onClose = callback;
        carouselStore.isClosable = false;
        carouselStore.cards = cards;
        carouselStore.isOpen = true;
    }

    static handleNotify(name: NotificationName): void {
        // TODO
        notificationStore.notifications.push(name);
    }

    static handleShowCards(cards: CardData[], callback: () => void): void {
        // TODO
    }

    static handleShowResults(results: RoundResult[]): void {
        // TODO
    }
}
