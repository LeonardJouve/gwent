<script lang="ts">
    import CardContainer from "$lib/components/card_container.svelte";
    import type {CardData, UnitRow} from "$lib/types/card";
    import type {Player} from "$lib/types/player";
    import {getCardScore, store} from "$lib/store/board.svelte";

    type Props = {
        rowName: UnitRow;
        player: Player;
    };
    const {rowName, player}: Props = $props();

    const row = $derived(store[player][rowName]);

    const getScore = $derived((card: CardData) => getCardScore(card, rowName, player));
</script>

<div class="hoverable row">
    <CardContainer
        cards={row.units}
        getScore={getScore}
    />
</div>

<style>
    .row {
        width: 100%;
        height: 100%;
    }
</style>
