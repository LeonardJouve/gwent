<script lang="ts">
    import CardContainer from "./card_container.svelte";
    import type {UnitRow} from "$lib/types/card";
    import type {Player} from "$lib/types/player";
    import {store} from "$lib/store/board.svelte";

    type Props = {
        rowName: UnitRow;
        player: Player;
    };
    const {rowName, player}: Props = $props();

    const row = $derived(store[player][rowName]);
</script>

<div class="hoverable row">
    <CardContainer cards={row.specials}/>
</div>

<style>
    .row {
        width: 100%;
        height: 100%;
    }
</style>
