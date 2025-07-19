<script lang="ts">
    import {store} from "$lib/store/game.svelte";
    import type {Player} from "$lib/types/player";
    import Card from "$lib/components/card.svelte";
    import {iconURL} from "$lib/utils";

    type Props = {
        player: Player;
    };
    const {player}: Props = $props();

    const playerData = $derived(store.playerDatas[player]);
</script>

<div class="leader">
    {#if playerData.leader}
        <Card
            card={playerData.leader}
            isSelectible={playerData.isLeaderAvailable}
        />
    {/if}
    {#if playerData.isLeaderAvailable}
        <img
            class="status"
            alt="active"
            src={iconURL("icon_leader_active")}
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
        position: relative;
    }

    .status {
        position: absolute;
        right: -14%;
        top: 50%;
        height: 30%;
        transform: translate(100%, -50%);
    }
</style>
