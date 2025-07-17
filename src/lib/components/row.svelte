<script lang="ts">
    import CardContainer from "$lib/components/card_container.svelte";
    import type {CardData, UnitRow} from "$lib/types/card";
    import type {Player} from "$lib/types/player";
    import {getCardScore, getRowScore, getRowWeather, store} from "$lib/store/board.svelte";
    import Score from "$lib/components/score.svelte";
    import {iconURL} from "$lib/utils";

    type Props = {
        rowName: UnitRow;
        player: Player;
    };
    const {rowName, player}: Props = $props();

    const row = $derived(store[player][rowName]);

    const getScore = $derived((card: CardData) => getCardScore(card, rowName, player));

    const weather = $derived(getRowWeather(rowName, player));
</script>

<div class="row">
    <div class="hoverable special-row">
        <!-- <CardContainer cards={row.specials}/> -->
    </div>
    <div class="hoverable unit-row">
        <CardContainer
            cards={row.units}
            getScore={getScore}
        />
    </div>
    <div class="score">
        <Score getScore={() => getRowScore(rowName, player)}/>
    </div>
    {#if weather}
        <img
            class="weather"
            alt={weather}
            src={iconURL("overlay_" + weather)}
        />
    {/if}
</div>

<style>
    .row {
        width: 100%;
        height: 100%;
        display: flex;
        gap: 1%;
        position: relative;
    }

    .special-row {
        flex: 0.15;
    }

    .unit-row {
        flex: 1;
    }

    .score {
        position: absolute;
        width: 5.3%;
        height: 43%;
        left: -1.1%;
        top: 50%;
        transform: translate(-100%, -50%);
    }

    .weather {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
</style>
