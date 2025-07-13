<script lang="ts">
    import CardContainer from "$lib/components/card_container.svelte";
    import {store as deckStore} from "$lib/store/deck.svelte";
    import {store as selectedCardStore} from "$lib/store/selected_card.svelte";
    import type {CardData} from "$lib/types/card";

    const handleSelect = $derived((card: CardData) => selectedCardStore.card = card);
</script>

<CardContainer
    cards={deckStore["me"].hand}
    onSelect={handleSelect}
/>
