import type {CardData} from "$lib/types/card";

type SelectedCardStore = {
    card?: CardData;
};

export const store = $state<SelectedCardStore>({});
