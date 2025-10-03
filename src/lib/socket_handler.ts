import {io} from "socket.io-client";
import type {SocketData, ClientSideSocket} from "@shared/types/socket";
import {PUBLIC_API_URL} from "$env/static/public";
import type {Play, RoundResult, State} from "@shared/types/game";
import {store as gameStore} from "$lib/store/game.svelte";
import {store as notificationStore} from "$lib/store/notifications.svelte";
import {store as carouselStore} from "$lib/store/carousel.svelte";
import type {CardData} from "@shared/types/card";
import type {NotificationName} from "@shared/types/notification";
import type {PlayerIndicator} from "@shared/types/player";

export class SocketHandler {
    private socketData: SocketData;
    private socket: ClientSideSocket;

    constructor(socketData: SocketData) {
        this.socketData = socketData;
        this.socket = io(PUBLIC_API_URL);

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
        gameStore.askStart = (player: PlayerIndicator): void => {
            callback(player);
            gameStore.askStart = undefined;
        };
    }

    static handleAskPlay(callback: (play: Play) => void): void {
        gameStore.askPlay = (play: Play): void => {
            callback(play);
            gameStore.askPlay = undefined;
            gameStore.selectedCard = undefined;
        };
    }

    static handleSelectCards(cards: CardData[], amount: number, isClosable: boolean, callback: (cards: CardData["filename"][]) => void): void {
        carouselStore.amount = amount;
        carouselStore.onClose = (c: CardData[]): void => callback(c.map(({filename}) => filename));
        carouselStore.isClosable = isClosable;
        carouselStore.cards = cards;
        carouselStore.isOpen = true;
    }

    static handleNotify(name: NotificationName): void {
        notificationStore.notifications.push(name);
    }

    static handleShowCards(cards: CardData[], callback: () => void): void {
        carouselStore.amount = 1;
        carouselStore.onClose = callback;
        carouselStore.isClosable = true;
        carouselStore.cards = cards;
        carouselStore.isOpen = true;
    }

    static handleShowResults(results: RoundResult[], winner: PlayerIndicator|null): void {
        gameStore.result = {
            results,
            winner,
        };
    }
}
