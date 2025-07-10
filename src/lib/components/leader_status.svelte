<script lang="ts">
    import type {Player} from "$lib/types/player";
    import {store} from "$lib/store/leaders.svelte";
    import {iconURL} from "$lib/utils";

    type Props = {
        player: Player;
    };

    const {player}: Props = $props();

    const leader = $derived(store[player]);
</script>

{#if leader.available}
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
