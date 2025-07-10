<script lang="ts">
    import type {Player} from "$lib/types/player";
    import CardPile from "$lib/components/card_pile.svelte";
    import {store} from "$lib/store/deck.svelte";
    import {iconURL} from "$lib/utils";
    import type {CardData} from "$lib/types/card";

    type Props = {
        player: Player;
    };
    const {player}: Props = $props();

    const deck = $derived(store[player]);
</script>

{#snippet cardBack(card: CardData)}
    <img
        alt={card.name}
        src={iconURL("deck_back_" + deck.faction, "jpg")}
        style:height={"100%"}
    />
{/snippet}

<CardPile
    cards={deck.cards}
    showCounter={true}
    render={cardBack}
/>
