<script lang="ts">
    import type {PlayerIndicator} from "@shared/types/player";
    import CardPile from "$lib/components/card_pile.svelte";
    import {store} from "$lib/store/game.svelte";
    import {backClass} from "$lib/utils";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const playerData = $derived(store.players[player]);
</script>

{#snippet cardBack()}
    <div class={[backClass(playerData.faction), "height"]}></div>
{/snippet}

<CardPile
    cardAmount={playerData.deck ? playerData.deck.length : playerData.deckSize}
    showCounter={true}
    render={cardBack}
/>
