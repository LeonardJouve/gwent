<script lang="ts">
    import {closeModal, store} from "$lib/store/carousel.svelte";
    import CardCarousel from "$lib/components/card_carousel.svelte";
</script>

{#if store.isOpen}
    <CardCarousel
        cards={store.cards}
        amount={store.amount}
        isClosable={store.isClosable}
        onClose={closeModal}
        startIndex={store.startIndex}
    />
{/if}
