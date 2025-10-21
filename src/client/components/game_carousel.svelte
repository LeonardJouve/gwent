<script lang="ts">
    import CardCarousel from "../components/card_carousel.svelte";
    import {store, closeCarousel} from "../store/carousel.svelte";
</script>

{#if store.isOpen}
    <CardCarousel
        cards={store.cards}
        amount={store.amount}
        isClosable={store.isClosable}
        onClose={closeCarousel}
        startIndex={store.startIndex}
    />closeCarousel
{/if}
