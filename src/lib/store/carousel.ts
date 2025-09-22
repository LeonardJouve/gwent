import type {CardData} from "@shared/types/card";

type CarouselStore = {
    isOpen: true;
    cards: CardData[];
    amount: number;
    isClosable: boolean;
    onClose: (cards: CardData[]) => void;
} | {
    isOpen: false;
    cards?: CardData[];
    amount?: number;
    isClosable?: boolean;
    onClose?: (cards: CardData[]) => void;
};

export const store = $state<CarouselStore>({isOpen: false});
