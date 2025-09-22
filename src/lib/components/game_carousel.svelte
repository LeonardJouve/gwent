<script lang="ts">
    import {store} from "$lib/store/carousel";
    import Carousel from "./carousel.svelte";
    import type {CardData} from "@shared/types/card";

    const handleClose = (cards: CardData[]): void => {
        store.onClose?.(cards);
        store.isOpen = false;
        store.cards = undefined;
        store.amount = undefined;
        store.isClosable = undefined;
        store.onClose = undefined;
    };
</script>

{#if store.isOpen}
    <Carousel
        cards={store.cards}
        amount={store.amount}
        isClosable={store.isClosable}
        onClose={handleClose}
    />
{/if}
