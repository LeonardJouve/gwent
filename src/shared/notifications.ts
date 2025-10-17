import type {NotificationName, Notification} from "./types/notification.js";

const notifications: Record<NotificationName, Notification> = {
    first_me: {
        message: "You will go first",
    },
    first_op: {
        message: "Your opponent will go first",
    },
    coin_me: {
        message: "You will go first",
        imageSource: "notif_me_coin",
    },
    coin_op: {
        message: "Your opponent will go first",
        imageSource: "notif_op_coin",
    },
    start_round: {
        message: "Round Start",
        imageSource: "notif_round_start",
    },
    pass_me: {
        message: "Round passed",
        imageSource: "notif_round_passed",
    },
    pass_op: {
        message: "Your opponent has passed",
        imageSource: "notif_round_passed",
    },
    win_round: {
        message: "You won the round!",
        imageSource: "notif_win_round",
    },
    lose_round: {
        message: "Your opponent won the round",
        imageSource: "notif_lose_round",
    },
    draw_round: {
        message: "The round ended in a draw",
        imageSource: "notif_draw_round",
    },
    turn_me: {
        message: "Your turn!",
        imageSource: "notif_me_turn",
    },
    turn_op: {
        message: "Opponent's turn",
        imageSource: "notif_op_turn",
    },
    north: {
        message: "Northern Realms faction ability triggered - North draws an additional card.",
        imageSource: "notif_north",
    },
    monsters: {
        message: "Monsters faction ability triggered - one randomly-chosen Monster Unit Card stays on the board",
        imageSource: "notif_monstarts",
    },
    scoiatael_me: {
        message: "Scoia'tael faction perk used, you go first.",
        imageSource: "notif_scoiatael",
    },
    scoiatael_op: {
        message: "Scoia'tael faction perk used, opponent goes first.",
        imageSource: "notif_scoiatael",
    },
    skellige_me: {
        message: "Skellige Ability Triggered!",
        imageSource: "notif_skellige",
    },
    skellige_op: {
        message: "Opponent Skellige Ability Triggered!",
        imageSource: "notif_skellige",
    },
};

export default notifications;
