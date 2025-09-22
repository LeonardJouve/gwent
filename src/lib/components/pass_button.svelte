<script lang="ts">
    import {store} from "$lib/store/game.svelte";

    const hasPassed = $derived(store.players["me"].hasPassed);

    const handleClick = () => {
        if (hasPassed || store.turn !== "me" || !store.askPlay) {
            return;
        }

        store.askPlay({type: "pass"});
    };
</script>

{#if !hasPassed}
    <button
        class="pass"
        onclick={handleClick}
    >
        Pass
    </button>
{/if}

<style>
    .pass {
        padding: 1px 3px 1px 3px;
        font-size: 2vw;
        font-weight: bold;
        color: goldenrod;

        border: .1vw solid goldenrod;
        border-radius: .5vw;
        background-color: rgba(20,20,20,.9);
    }
</style>
