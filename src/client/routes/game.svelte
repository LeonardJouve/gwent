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
    import {SocketDataSchema} from "@shared/types/socket";
    import {resetGame} from "../store/game.svelte";

    let socketHandler = $state<SocketHandler|null>(null);

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

    const players: PlayerIndicator[] = ["opponent", "me"];
    const rows: UnitRow[] = ["close", "ranged", "siege"];

    onMount(() => {
        resetGame();

        try {
            const url = new URL(window.location.href);
            const socketData = SocketDataSchema.parse({
                id: url.searchParams.get("id"),
                matchId: url.searchParams.get("matchId"),
            });

            socketHandler = new SocketHandler(socketData, () => navigate("/"));
        } catch (_) {
            navigate("/");
        }
    });

    const getPosition = $derived((leftPercent: number, widthPercent: number, topPercent: number, heightPercent: number) => {
        const position = "position: absolute";
        const left = `left: ${leftPercent}%`;
        const top = `top: ${topPercent}%`;
        const width = `width: ${widthPercent}%`;
        const height = `height: ${heightPercent}%`;
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
</script>

<div class="game">
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

    <div style={getPosition(17, 0, 80.5, 0)}>
        <PassButton/>
    </div>
    <div style={getPosition(laneLeftPercent, 49.4, 77.8, 12)}>
        <Hand/>
    </div>
    <div style={getPosition(7.3, 14.6, 41.3, 13)}>
        <Weather/>
    </div>
    <div style={getPosition(26, 3.5, 81, 6)}>
        <SoundtrackToggle/>
    </div>
    <div style={getPosition(79.3, 17, 20, 56.3)}>
        <SelectedCard/>
    </div>
    <Notification/>
    <GameCarousel/>
    <Result/>
    <ScoiataelModal/>
</div>

<style>
    .game {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 0;
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
