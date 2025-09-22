<script lang="ts">
    import {store} from "$lib/store/game.svelte";
    import type { PlayerIndicator } from "@shared/types/player";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const hasPassed = $derived(store.players[player].hasPassed);
</script>

{#if hasPassed}
    <h3 class="passed">
        Passed
    </h3>
{/if}

<style>
    .passed {
        font-size: 2vw;
        font-weight: bold;
        color: tan;
        text-shadow: 4px 4px 10px black;
    }
</style>
