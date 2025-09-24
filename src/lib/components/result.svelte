<script lang="ts">
    import {goto} from "$app/navigation";
    import {iconURL} from "$lib/utils";
    import {store} from "$lib/store/game.svelte";

    let modal: HTMLDialogElement;

    $effect(() => {
        if (store.result) {
            modal.showModal();
        } else {
            modal.close();
        }
    });

    const results = $derived.by(() => {
        if (!store.result) {
            return null;
        }

        const {winner, results} = store.result;

        return {
            roundResults: results,
            gameResult: winner === null ?
                "draw" :
                winner === "me" ?
                    "win" :
                    "lose",
        };
    });

    const handleMenu = () => {
        store.result = undefined;
        goto("/");
    };

    const handleReplay = () => {
        // TODO
    };
</script>

<dialog
    class="modal"
    bind:this={modal}
>
    {#if results}
        {@const {gameResult, roundResults} = results}
        <img
            class="image"
            alt={gameResult}
            src={iconURL(`end_${gameResult}`)}
        />
        <table>
            <tbody>
                <tr>
                    <th></th>
                    {#each roundResults as _, i}
                        <th class="header">{`Round ${i + 1}`}</th>
                    {/each}
                </tr>
                {#each Object.entries(store.players) as [key, player]}
                    {@const playerIndicator = key as keyof typeof store.players}
                    <tr>
                        <th class="name">{player.name}</th>
                        {#each roundResults as result}
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
    {/if}
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
