<script lang="ts">
    import {onMount} from "svelte";
    import Deck from "$lib/components/deck.svelte";
    import Grave from "$lib/components/grave.svelte";
    import Hand from "$lib/components/hand.svelte";
    import Leader from "$lib/components/leader.svelte";
    import LeaderStatus from "$lib/components/leader_status.svelte";
    import Weather from "$lib/components/weather.svelte";
    import Row from "$lib/components/row.svelte";
    import type {Player} from "$lib/types/player";
    import type {UnitRow} from "$lib/types/card";
    import RowSpecial from "$lib/components/row_special.svelte";

    type Rect = {
        top: number;
        left: number;
        width: number;
        height: number;
    };

    const rowTopPercents = [
        1.4,
        13.8,
        26.4,
        40.3,
        52.7,
        65.3,
    ];
    const rowHeightPercent = 10.8;

    const pileWidthPercent = 5.8;
    const pileHeightPercent = 13.4;
    const pileTopPercents = [
        6.5,
        76.6,
    ];

    const scoreWidthPercent = 2.5;
    const scoreHeightPercent = 4.4;

    const laneLeftPercent = 29.7;

    let boardImage: HTMLImageElement;
    let boardBoundingRect = $state<Rect>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    const players: Player[] = ["opponent", "me"];
    const rows: UnitRow[] = ["close", "ranged", "siege"];

    onMount(() => {
        function resizeImage() {
            const imageRatio = boardImage.naturalWidth / boardImage.naturalHeight;
            const viewportRatio = window.innerWidth / window.innerHeight;

            if (imageRatio < viewportRatio) {
                boardImage.style.width = "auto";
                boardImage.style.height = "100%";
            } else {
                boardImage.style.width = "100%";
                boardImage.style.height = "auto";
            }

            boardBoundingRect = boardImage.getBoundingClientRect();
        }

        resizeImage();
        window.addEventListener("resize", resizeImage);
        return () => window.removeEventListener("resize", resizeImage);
    });

    const getPosition = $derived((getLeftPercent: () => number, getWidthPercent: () => number, getTopPercent: () => number, getHeightPercent: () => number) => {
        const horizontalPercent = boardBoundingRect.width / 100;
        const verticalPercent = boardBoundingRect.height / 100;

        const position = "position: absolute";
        const left = `left: ${boardBoundingRect.left + (getLeftPercent() * horizontalPercent)}px`;
        const top = `top: ${boardBoundingRect.top + (getTopPercent() * verticalPercent)}px`;
        const width = `width: ${getWidthPercent() * horizontalPercent}px`;
        const height = `height: ${getHeightPercent() * verticalPercent}px`;
        return [position, left, top, width, height].join("; ");
    })

    const getRowPosition = $derived((index: number) => {
        const leftPercent = 36.9;
        const widthPercent = 42.2;

        return getPosition(() => leftPercent, () => widthPercent, () => rowTopPercents[index], () => rowHeightPercent);
    });

    const getSpecialPosition = $derived((index: number) => {
        const widthPercent = 6.6;

        return getPosition(() => laneLeftPercent, () => widthPercent, () => rowTopPercents[index], () => rowHeightPercent);
    });

    const getRowScorePosition = $derived((index: number) => {
        const leftPercent = 26.6;
        const topPercents = [
            4.5,
            16.6,
            29.4,
            43.1,
            55.5,
            68.2,
        ];

        return getPosition(() => leftPercent, () => scoreWidthPercent, () => topPercents[index], () => scoreHeightPercent);
    });

    const getScorePosition = $derived((index: number) => {
        const leftPercent = 22.3;
        const topPercents = [
            28.4,
            65.6,
        ];

        return getPosition(() => leftPercent, () => scoreWidthPercent, () => topPercents[index], () => scoreHeightPercent);
    });

    const getLeaderPosition = $derived((index: number) => {
        const leftPercent = 7.1;
        const widthPercent = 5.5;
        const heightPercent = 12.9;
        const topPercents = [
            7.1,
            76.8,
        ];

        return getPosition(() => leftPercent, () => widthPercent, () => topPercents[index], () => heightPercent);
    });

    const getLeaderStatusPosition = $derived((index: number) => {
        const leftPercent = 13.6;
        const widthPercent = 1.8;
        const heightPercent = 3.2;
        const topPercents = [
            12.2,
            81.9,
        ];

        return getPosition(() => leftPercent, () => widthPercent, () => topPercents[index], () => heightPercent);
    });

    const getGravePosition = $derived((index: number) => {
        const leftPercent = 80.5;

        return getPosition(() => leftPercent, () => pileWidthPercent, () => pileTopPercents[index], () => pileHeightPercent);
    });

    const getDeckPosition = $derived((index: number) => {
        const leftPercent = 89.8;

        return getPosition(() => leftPercent, () => pileWidthPercent, () => pileTopPercents[index], () => pileHeightPercent);
    });

    const getHandPosition = $derived(() => {
        const widthPercent = 49.4;
        const heightPercent = 12;
        const topPercent = 77.8;

        return getPosition(() => laneLeftPercent, () => widthPercent, () => topPercent, () => heightPercent);
    });

    const getWeatherPosition = $derived(() => {
        const leftPercent = 7.3;
        const widthPercent = 14.6;
        const heightPercent = 13;
        const topPercent = 41.3;

        return getPosition(() => leftPercent, () => widthPercent, () => topPercent, () => heightPercent);
    });
</script>

<div class="game">
    <img
        class="board"
        alt="board"
        src="assets/img/board.jpg"
        bind:this={boardImage}
    />

    {#each players as player, i}
        {#each rows as _, j}
            {@const isMe = player === "me"}
            {@const indexOffset = isMe ? 3 : 0}
            {@const row = rows[isMe ? j : (2 - j)]}

            <div style={getRowScorePosition(j + indexOffset)}></div>
            <div style={getSpecialPosition(j + indexOffset)}>
                <RowSpecial
                    player={player}
                    rowName={row}
                />
            </div>
            <div style={getRowPosition(j + indexOffset)}>
                <Row
                    player={player}
                    rowName={row}
                />
            </div>
        {/each}

        <div style={getLeaderPosition(i)}>
            <Leader player={player}/>
        </div>
        <div style={getLeaderStatusPosition(i)}>
            <LeaderStatus player={player}/>
        </div>
        <div style={getScorePosition(i)}></div>
        <div style={getGravePosition(i)}>
            <Grave player={player}/>
        </div>
        <div style={getDeckPosition(i)}>
            <Deck player={player}/>
        </div>
    {/each}

    <div style={getHandPosition()}>
        <Hand/>
    </div>
    <div style={getWeatherPosition()}>
        <Weather/>
    </div>
</div>

<style>
    .game {
        width: 100vw;
        height: 100vh;
        position: relative;
        background-color: rgba(10,10,10,.95);
    }

    .board {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    :global(.hoverable) {
        box-sizing: border-box;

        &:hover {
            border: solid 2px goldenrod;
            background-color: rgba(218, 165, 32, 0.1);
        }

        &:not(:hover) {
            border: solid 2px transparent;
        }
    }
</style>
