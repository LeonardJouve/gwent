<script lang="ts">
    import {closeModal, store} from "../store/carousel.svelte";
    import CardCarousel from "../components/card_carousel.svelte";
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
