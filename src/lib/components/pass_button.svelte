<script lang="ts">
    import {store} from "$lib/store/game.svelte";
    import Button from "$lib/components/button.svelte";

    const hasPassed = $derived(store.players["me"].hasPassed);

    const handleClick = () => {
        if (hasPassed || store.turn !== "me" || !store.askPlay) {
            return;
        }

        store.askPlay({type: "pass"});
    };
</script>

{#if !hasPassed}
    <Button
        onclick={handleClick}
        content="Pass"
    />
{/if}
