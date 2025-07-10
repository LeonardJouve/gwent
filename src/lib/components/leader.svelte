<script lang="ts">
    import {store} from "$lib/store/leaders.svelte";
    import type {Player} from "$lib/types/player";
    import { smallURL } from "$lib/utils";

    type Props = {
        player: Player;
    };

    const {player}: Props = $props();

    const leader = $derived(store[player]);
</script>

<div class="leader">
    {#if leader.leader}
        <img
            class={{hoverable: leader.available}}
            alt={leader.leader.name}
            src={smallURL(leader.leader)}
        />
    {/if}
</div>

<style>
    .leader {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    img {
        height: 100%;
    }
</style>
