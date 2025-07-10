import type {CardData} from "$lib/types/card";

const imgURL = (prefix: string, file: string, ext: string): string => "assets/img/" + prefix + "/" + file + "." + ext;

export const iconURL = (file: string, ext = "png"): string => imgURL("icons", file, ext);

export const largeURL = (card: CardData, ext = "jpg"): string => imgURL("lg", card.deck + "_" + card.filename, ext);

export const smallURL = (card: CardData, ext = "jpg"): string => imgURL("sm", card.deck + "_" + card.filename, ext);

