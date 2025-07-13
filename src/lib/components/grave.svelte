<script lang="ts">
    import {store} from "$lib/store/deck.svelte";
    import type {CardData} from "$lib/types/card";
    import type {Player} from "$lib/types/player";
    import Card from "$lib/components/card.svelte";
    import CardPile from "$lib/components/card_pile.svelte";

    type Props = {
        player: Player;
    };
    const {player}: Props = $props();

    const deck = $derived(store[player]);
</script>

{#snippet card(card: CardData)}
    <Card card={card}/>
{/snippet}

<div class="grave hoverable">
    <CardPile
        cards={deck.grave}

        render={card}
    />
</div>

<style>
    .grave {
        width: 100%;
        height: 100%;
    }
</style>
