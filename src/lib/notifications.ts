import {iconURL} from "$lib/utils";
import type {NotificationName, Notification} from "@shared/types/notification";

const notifURL = (name: string): string => iconURL("notif_" + name);

const notifications: Record<NotificationName, Notification> = {
    first_me: {
        message: "You will go first",
    },
    first_op: {
        message: "Your opponent will go first",
    },
    coin_me: {
        message: "You will go first",
        imageSource: notifURL("me_coin"),
    },
    coin_op: {
        message: "Your opponent will go first",
        imageSource: notifURL("op_coin"),
    },
    start_round: {
        message: "Round Start",
        imageSource: notifURL("round_start"),
    },
    pass_me: {
        message: "Round passed",
        imageSource: notifURL("round_passed"),
    },
    pass_op: {
        message: "Your opponent has passed",
        imageSource: notifURL("round_passed"),
    },
    win_round: {
        message: "You won the round!",
        imageSource: notifURL("win_round"),
    },
    lose_round: {
        message: "Your opponent won the round",
        imageSource: notifURL("lose_round"),
    },
    draw_round: {
        message: "The round ended in a draw",
        imageSource: notifURL("draw_round"),
    },
    turn_me: {
        message: "Your turn!",
        imageSource: notifURL("me_turn"),
    },
    turn_op: {
        message: "Opponent's turn",
        imageSource: notifURL("op_turn"),
    },
    north: {
        message: "Northern Realms faction ability triggered - North draws an additional card.",
        imageSource: notifURL("north"),
    },
    monsters: {
        message: "Monsters faction ability triggered - one randomly-chosen Monster Unit Card stays on the board",
        imageSource: notifURL("monstarts"),
    },
    scoiatael: {
        message: "Opponent used the Scoia'tael faction perk to go first.",
        imageSource: notifURL("scoiatael"),
    },
    skellige_me: {
        message: "Skellige Ability Triggered!",
        imageSource: notifURL("skellige"),
    },
    skellige_op: {
        message: "Opponent Skellige Ability Triggered!",
        imageSource: notifURL("skellige"),
    },
};

export default notifications;
