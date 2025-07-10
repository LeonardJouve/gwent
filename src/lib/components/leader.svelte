<script lang="ts">
    import {store} from "$lib/store/leaders.svelte";
    import type {Player} from "$lib/types/player";
    import { smallURL } from "$lib/utils";
    import Card from "./card.svelte";

    type Props = {
        player: Player;
    };

    const {player}: Props = $props();

    const leader = $derived(store[player]);
</script>

<div class="leader">
    {#if leader.leader}
        <Card
            card={leader.leader}
            isSelectible={leader.available}
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
