<script lang="ts">
    import {closeModal, store} from "$lib/store/carousel.svelte";
    import Carousel from "$lib/components/carousel.svelte";
</script>

{#if store.isOpen}
    <Carousel
        cards={store.cards}
        amount={store.amount}
        isClosable={store.isClosable}
        onClose={closeModal}
        startIndex={store.startIndex}
    />
{/if}
