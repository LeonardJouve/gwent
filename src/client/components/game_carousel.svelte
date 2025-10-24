<script lang="ts">
    import type {CardSelection} from "@shared/types/socket";
    import CardCarousel from "../components/card_carousel.svelte";
    import {store, resetCarousel} from "../store/carousel.svelte";

    const handleCloseCarousel = (selection: CardSelection|null) => {
        store.onClose?.(selection);
        resetCarousel();
    }
</script>

{#if store.isOpen}
    <CardCarousel
        cards={store.cards}
        isClosable={store.isClosable}
        onClose={handleCloseCarousel}
        startIndex={store.startIndex}
    />
{/if}
