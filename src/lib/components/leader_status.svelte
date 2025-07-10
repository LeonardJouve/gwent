<script lang="ts">
    import { store } from "$lib/store/deck.svelte";
    import type {Player} from "$lib/types/player";
    import {iconURL} from "$lib/utils";

    type Props = {
        player: Player;
    };

    const {player}: Props = $props();

    const deck = $derived(store[player]);
</script>

{#if deck.isLeaderAvailable}
    <img
        alt="active"
        src={iconURL("icon_leader_active")}
    />
{/if}

<style>
    img {
        width: 100%;
        height: 100%;
    }
</style>
