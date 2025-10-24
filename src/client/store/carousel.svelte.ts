import type {CardData} from "@shared/types/card";
import type {CardSelection} from "@shared/types/socket";

export type Modal = {
    isOpen: true;
    cards: CardData[];
    isClosable: boolean;
    startIndex?: number;
    onClose: (selection: CardSelection|null) => void;
};

type CarouselStore = Modal | {
    isOpen: false;
    cards?: CardData[];
    isClosable?: boolean;
    startIndex?: number;
    onClose?: (selection: CardSelection|null) => void;
};

export const store = $state<CarouselStore>({isOpen: false});

export const openCarousel = ({onClose, isClosable, cards, startIndex}: Omit<Modal, "isOpen">): void => {
    if (!cards.length) {
        return;
    }

    store.onClose = onClose;
    store.isClosable = isClosable;
    store.cards = cards;
    store.startIndex = startIndex;
    store.isOpen = true;
};

export const resetCarousel = (): void => {
    store.onClose = undefined;
    store.isOpen = false;
    store.cards = undefined;
    store.isClosable = undefined;
    store.onClose = undefined;
};
