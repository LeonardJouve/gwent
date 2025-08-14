<script lang="ts">
    import type {PlayerIndicator} from "@shared/types/player";
    import CardPile from "$lib/components/card_pile.svelte";
    import {store} from "$lib/store/game.svelte";
    import {iconURL} from "$lib/utils";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const playerData = $derived(store.players[player]);
</script>

{#snippet cardBack()}
    <img
        alt={`${playerData.faction} card back`}
        src={iconURL("deck_back_" + playerData.faction, "jpg")}
        style:height="100%"
    />
{/snippet}

<CardPile
    cardAmount={playerData.deck ? playerData.deck.length : playerData.deckSize}
    showCounter={true}
    render={cardBack}
/>
