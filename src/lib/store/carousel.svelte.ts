import type {CardData} from "@shared/types/card";

export type Modal = {
    isOpen: true;
    cards: CardData[];
    amount: number;
    isClosable: boolean;
    startIndex?: number;
    onClose: (cards: CardData[]) => void;
};

type CarouselStore = Modal | {
    isOpen: false;
    cards?: CardData[];
    amount?: number;
    isClosable?: boolean;
    startIndex?: number;
    onClose?: (cards: CardData[]) => void;
};

export const store = $state<CarouselStore>({isOpen: false});

export const openModal = ({amount, onClose, isClosable, cards, startIndex}: Omit<Modal, "isOpen">): void => {
    store.amount = amount;
    store.onClose = onClose;
    store.isClosable = isClosable;
    store.cards = cards;
    store.startIndex = startIndex;
    store.isOpen = true;
};

export const closeModal = (cards: CardData[]): void => {
    store.onClose?.(cards);
    store.isOpen = false;
    store.cards = undefined;
    store.amount = undefined;
    store.isClosable = undefined;
    store.onClose = undefined;
};
