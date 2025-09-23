<script lang="ts">
    import {onMount} from "svelte";
    import {iconURL} from "$lib/utils";
    import {store} from "$lib/store/game.svelte";
    import type {RoundResult} from "@shared/types/game";
    import type {PlayerIndicator} from "@shared/types/player";
    import { goto } from "$app/navigation";

    type Props = {
        results: RoundResult[];
        winner: PlayerIndicator|null;
    };
    const {results, winner}: Props = $props();

    let modal: HTMLDialogElement;

    onMount(() => modal.showModal());

    const result = $derived(winner === null ?
        "draw" :
        winner === "me" ?
            "win" :
            "lose");

    const handleMenu = () => goto("/");

    const handleReplay = () => {
        // TODO
    };
</script>

<dialog
    class="modal"
    bind:this={modal}
>
    <img
        class="image"
        alt={result}
        src={iconURL(`end_${result}`)}
    />
    <table>
        <tbody>
            <tr>
                <th></th>
                {#each results as _, i}
                    <th class="header">{`Round ${i + 1}`}</th>
                {/each}
            </tr>
            {#each Object.entries(store.players) as [key, player]}
                {@const playerIndicator = key as keyof typeof store.players}
                <tr>
                    <th class="name">{player.name}</th>
                    {#each results as result}
                        <td class={{
                            result: true,
                            winner: result.winner === playerIndicator,
                        }}>
                            {result.scores[playerIndicator]}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
    <div class="actions">
        <button onclick={handleMenu}>
            Menu
        </button>
        <button onclick={handleReplay}>
            Replay
        </button>
    </div>
</dialog>

<style>
    .modal {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 50px;

        &::backdrop {
            background-color: black;
            opacity: 0.9;
        }
    }

    .image {
        max-width: 500px;
    }

    .header {
        color: rgb(100,100,100);
    }

    .result {
        color: rgb(180,180,180);
        font-size: xx-large;
    }

    .name {
        font-size: large;
    }

    .name, .winner {
        color: goldenrod;
    }

    .actions {
        display: flex;
        justify-content: space-evenly;
    }

    th, td {
        padding: 25px;
        text-align: center;
    }

    button {
        padding: 1px 3px 1px 3px;
        font-size: 2vw;
        font-weight: bold;
        color: goldenrod;

        border: .1vw solid goldenrod;
        border-radius: .5vw;
    }
</style>
