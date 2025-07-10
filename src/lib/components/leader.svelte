<script lang="ts">
    import {store} from "$lib/store/deck.svelte";
    import type {Player} from "$lib/types/player";
    import Card from "./card.svelte";

    type Props = {
        player: Player;
    };

    const {player}: Props = $props();

    const deck = $derived(store[player]);
</script>

<div class="leader">
    {#if deck.leader}
        <Card
            card={deck.leader}
            isSelectible={deck.isLeaderAvailable}
        />
    {/if}
</div>

<style>
    .leader {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: end;
    }
</style>
