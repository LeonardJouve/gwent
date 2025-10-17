import {io} from "socket.io-client";
import type {SocketData, ClientSideSocket} from "@shared/types/socket";
import type {Play, RoundResult, State} from "@shared/types/game";
import {store as gameStore} from "../store/game.svelte";
import {store as notificationStore} from "../store/notifications.svelte";
import {openModal} from "../store/carousel.svelte";
import type {CardData} from "@shared/types/card";
import type {NotificationName} from "@shared/types/notification";
import type {PlayerIndicator} from "@shared/types/player";

export class SocketHandler {
    private socketData: SocketData;
    private socket: ClientSideSocket;

    constructor(socketData: SocketData) {
        this.socketData = socketData;
        this.socket = io(import.meta.env.VITE_API_URL);

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
        openModal({
            amount,
            isClosable,
            cards,
            onClose: (c: CardData[]): void => callback(c.map(({filename}) => filename)),
        });
    }

    static handleNotify(name: NotificationName): void {
        notificationStore.notifications.push(name);
    }

    static handleShowCards(cards: CardData[], callback: () => void): void {
        openModal({
            amount: 1,
            isClosable: true,
            cards,
            onClose: callback,
        });
    }

    static handleShowResults(results: RoundResult[], winner: PlayerIndicator|null): void {
        gameStore.result = {
            results,
            winner,
        };
    }
}
