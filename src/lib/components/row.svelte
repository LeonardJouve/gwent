<script lang="ts">
    import CardContainer from "$lib/components/card_container.svelte";
    import type {CardData, UnitRow} from "@shared/types/card";
    import type {PlayerIndicator} from "@shared/types/player";
    import {getRowScore, getRowWeather, store} from "$lib/store/game.svelte";
    import Score from "$lib/components/score.svelte";
    import {iconURL} from "$lib/utils";

    type Props = {
        rowName: UnitRow;
        player: PlayerIndicator;
    };
    const {rowName, player}: Props = $props();

    const row = $derived(store.board.rows[player][rowName]);

    const weather = $derived(getRowWeather(rowName));

    const canPlay = $derived(store.selectedCard && store.turn === "me" && store.askPlay);

    const handleRowClick = (type: CardData["type"]) => () => {
        if (canPlay && store.selectedCard?.type === type && store.askPlay) {
            store.askPlay({
                type: "card",
                card: store.selectedCard.filename,
                row: rowName,
            });
        }
    };
</script>

<div class="row">
    <div class="hoverable special-row">
        <CardContainer
            cards={row.special}
            onClick={handleRowClick("special")}
            canOpenCarousel={!canPlay}
        />
    </div>
    <div class="hoverable unit-row">
        <CardContainer
            cards={row.units.map(({card}) => card)}
            scores={row.units.map(({score}) => score)}
            onClick={handleRowClick("unit")}
            canOpenCarousel={!canPlay}
        />
    </div>
    <div class="score">
        <Score getScore={(): number => getRowScore(rowName, player)}/>
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
