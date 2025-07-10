<script lang="ts">
    import type {Player} from "$lib/types/player";
    import CardPile from "$lib/components/card_pile.svelte";
    import {store} from "$lib/store/deck.svelte";
    import {iconURL} from "$lib/utils";

    type Props = {
        player: Player;
    };
    const {player}: Props = $props();

    const deck = $derived(store[player]);
</script>

<div class="deck">
    <CardPile
        cards={deck.cards}
        showCounter={true}
        getSource={() => iconURL("deck_back_" + deck.faction, "jpg")}
    />
</div>

<style>
    .deck {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
</style>
