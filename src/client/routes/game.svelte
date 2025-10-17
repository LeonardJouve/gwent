<script lang="ts">
    import {onMount} from "svelte";
    import {navigate} from "svelte5-router";
    import Deck from "../components/deck.svelte";
    import Grave from "../components/grave.svelte";
    import Hand from "../components/hand.svelte";
    import Leader from "../components/leader.svelte";
    import Weather from "../components/weather.svelte";
    import Row from "../components/row.svelte";
    import type {PlayerIndicator} from "@shared/types/player";
    import type {UnitRow} from "@shared/types/card";
    import SoundtrackToggle from "../components/soundtrack_toggle.svelte";
    import SelectedCard from "../components/selected_card.svelte";
    import Notification from "../components/notification.svelte";
    import PlayerInformations from "../components/player_informations.svelte";
    import {SocketHandler} from "../utils/socket_handler";
    import GameCarousel from "../components/game_carousel.svelte";
    import PassButton from "../components/pass_button.svelte";
    import PassIndicator from "../components/pass_indicator.svelte";
    import Result from "../components/result.svelte";
    import ScoiataelModal from "../components/scoiatael_modal.svelte";
    import {imgURL} from "../utils/utils";
    import {SocketDataSchema} from "@shared/types/socket";

    let socketHandler = $state<SocketHandler|null>(null);

    onMount(() => {
        try {
            const url = new URL(window.location.href);
            const socketData = SocketDataSchema.parse({
                id: url.searchParams.get("id"),
                matchId: url.searchParams.get("matchId"),
            });

            socketHandler = new SocketHandler(socketData);
        } catch (_) {
            navigate("/");
        }
    });

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

    const laneLeftPercent = 29.7;

    let gameContainer: HTMLDivElement;
    let boardImage: HTMLImageElement;
    let boardBoundingRect = $state<Rect>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    const players: PlayerIndicator[] = ["opponent", "me"];
    const rows: UnitRow[] = ["close", "ranged", "siege"];

    onMount(() => {
        const observer = new ResizeObserver(() => {
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
        });
        observer.observe(boardImage);
        observer.observe(gameContainer);

        return () => observer.disconnect();
    });

    const getPosition = $derived((leftPercent: number, widthPercent: number, topPercent: number, heightPercent: number) => {
        const horizontalPercent = boardBoundingRect.width / 100;
        const verticalPercent = boardBoundingRect.height / 100;

        const position = "position: absolute";
        const left = `left: ${boardBoundingRect.left + leftPercent * horizontalPercent}px`;
        const top = `top: ${boardBoundingRect.top + topPercent * verticalPercent}px`;
        const width = `width: ${widthPercent * horizontalPercent}px`;
        const height = `height: ${heightPercent * verticalPercent}px`;
        return [position, left, top, width, height].join("; ");
    });

    const getRowPosition = $derived((index: number) => {
        const widthPercent = 49.4;

        return getPosition(laneLeftPercent, widthPercent, rowTopPercents[index], rowHeightPercent);
    });

    const getLeaderPosition = $derived((index: number) => {
        const leftPercent = 7.1;
        const widthPercent = 5.5;
        const heightPercent = 12.9;
        const topPercents = [
            7.1,
            76.8,
        ];

        return getPosition(leftPercent, widthPercent, topPercents[index], heightPercent);
    });

    const getGravePosition = $derived((index: number) => {
        const leftPercent = 80.5;

        return getPosition(leftPercent, pileWidthPercent, pileTopPercents[index], pileHeightPercent);
    });

    const getDeckPosition = $derived((index: number) => {
        const leftPercent = 89.8;

        return getPosition(leftPercent, pileWidthPercent, pileTopPercents[index], pileHeightPercent);
    });

    const getPlayerInformationsPosition = $derived((index: number) => {
        const leftPercent = 0;
        const widthPercent = 23.5;
        const topPercents = [
            23.3,
            60.5,
        ];
        const heightPercent = 15;

        return getPosition(leftPercent, widthPercent, topPercents[index], heightPercent);
    });

    const getPassIndicatorPosition = $derived((index: number) => {
        const leftPercent = 20.5;
        const widthPercent = 0;
        const heightPercent = 0;
        const topPercents = [
            30.5,
            68,
        ];

        return getPosition(leftPercent, widthPercent, topPercents[index], heightPercent);
    });

    const handPosition = $derived.by(() => {
        const widthPercent = 49.4;
        const heightPercent = 12;
        const topPercent = 77.8;

        return getPosition(laneLeftPercent, widthPercent, topPercent, heightPercent);
    });

    const weatherPosition = $derived.by(() => {
        const leftPercent = 7.3;
        const widthPercent = 14.6;
        const heightPercent = 13;
        const topPercent = 41.3;

        return getPosition(leftPercent, widthPercent, topPercent, heightPercent);
    });

    const soundtrackTogglePosition = $derived.by(() => {
        const leftPercent = 26;
        const widthPercent = 3.5;
        const heightPercent = 6;
        const topPercent = 81;

        return getPosition(leftPercent, widthPercent, topPercent, heightPercent);
    });

    const selectedCardPosition = $derived.by(() => {
        const leftPercent = 79.3;
        const widthPercent = 17;
        const heightPercent = 56.3;
        const topPercent = 20;

        return getPosition(leftPercent, widthPercent, topPercent, heightPercent);
    });

    const passButtonPosition = $derived.by(() => {
        const leftPercent = 17;
        const widthPercent = 0;
        const heightPercent = 0;
        const topPercent = 80.5;

        return getPosition(leftPercent, widthPercent, topPercent, heightPercent);
    });
</script>

<div
    class="game"
    bind:this={gameContainer}
>
    <img
        class="board"
        alt="board"
        src={imgURL("board", "jpg")}
        bind:this={boardImage}
    />

    {#each players as player, i}
        {#each rows as _, j}
            {@const isMe = player === "me"}
            {@const indexOffset = isMe ? 3 : 0}
            {@const row = rows[isMe ? j : 2 - j]}

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
        <div style={getGravePosition(i)}>
            <Grave player={player}/>
        </div>
        <div style={getDeckPosition(i)}>
            <Deck player={player}/>
        </div>
        <div style={getPlayerInformationsPosition(i)}>
            <PlayerInformations player={player}/>
        </div>

        <div style={getPassIndicatorPosition(i)}>
            <PassIndicator player={player}/>
        </div>
    {/each}

    <div style={passButtonPosition}>
        <PassButton/>
    </div>
    <div style={handPosition}>
        <Hand/>
    </div>
    <div style={weatherPosition}>
        <Weather/>
    </div>
    <div style={soundtrackTogglePosition}>
        <SoundtrackToggle/>
    </div>
    <div style={selectedCardPosition}>
        <SelectedCard/>
    </div>
    <Notification/>
    <GameCarousel/>
    <Result/>
    <ScoiataelModal/>
</div>

<style>
    .game {
        width: 100vw;
        height: 100vh;
        position: relative;
        background-color: rgba(10,10,10,.95);
        z-index: 0;
    }

    .board {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
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
