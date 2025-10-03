import type {CardData} from "@shared/types/card";

export type Modal = {
    isOpen: true;
    cards: CardData[];
    amount: number;
    isClosable: boolean;
    onClose: (cards: CardData[]) => void;
};

type CarouselStore = Modal | {
    isOpen: false;
    cards?: CardData[];
    amount?: number;
    isClosable?: boolean;
    onClose?: (cards: CardData[]) => void;
};

export const store = $state<CarouselStore>({isOpen: false});

export const openModal = ({amount, onClose, isClosable, cards}: Omit<Modal, "isOpen">): void => {
    store.amount = amount;
    store.onClose = onClose;
    store.isClosable = isClosable;
    store.cards = cards;
    store.isOpen = true;
};
