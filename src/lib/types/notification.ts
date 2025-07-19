export type NotificationName =
    "first_me" |
    "first_op" |
    "coin_me" |
    "coin_op" |
    "pass_me" |
    "pass_op" |
    "start_round" |
    "win_round" |
    "lose_round" |
    "draw_round" |
    "turn_me" |
    "turn_op" |
    "north" |
    "monsters" |
    "scoiatael" |
    "skellige_me" |
    "skellige_op";

export type Notification = {
    message: string;
    imageSource?: string;
};
