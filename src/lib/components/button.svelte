<script lang="ts">
    import type {Snippet} from "svelte";
    import type {HTMLButtonAttributes} from "svelte/elements";

    type Props = {
        content: Snippet<[]>|string;
    } & HTMLButtonAttributes;
    const {content, ...rest}: Props = $props();
</script>

<button {...rest}>
    {#if typeof content === "string"}
        {content}
    {:else}
        {@render content()}
    {/if}
</button>

<style>
    button {
        padding: 1px 3px 1px 3px;
        font-size: 2vw;
        font-weight: bold;
        color: goldenrod;

        border: .1vw solid goldenrod;
        border-radius: .5vw;
    }
</style>
