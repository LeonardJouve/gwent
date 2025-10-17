<script lang="ts">
    import type {PlayerIndicator} from "@shared/types/player";
    import CardPile from "../components/card_pile.svelte";
    import {store} from "../store/game.svelte";
    import {backClass} from "../utils/utils";

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
