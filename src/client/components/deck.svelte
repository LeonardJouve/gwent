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

<div class="container">
    <CardPile
        cardAmount={playerData.deck ? playerData.deck.length : playerData.deckSize}
        showCounter={true}
        render={cardBack}
    />
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        border: solid 2px transparent;
        box-sizing: border-box;
    }
</style>
