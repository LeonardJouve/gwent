<script lang="ts">
    import type {Snippet} from "svelte";
    import type {ClassValue, HTMLButtonAttributes} from "svelte/elements";

    type Props = {
        content: Snippet<[]>|string;
        variant?: ClassValue;
    } & HTMLButtonAttributes;
    const {
        content,
        variant = "medium",
        ...rest
    }: Props = $props();
</script>

<button class={variant} {...rest}>
    {#if typeof content === "string"}
        {content}
    {:else}
        {@render content()}
    {/if}
</button>

<style>
    button {
        padding: 1px 3px 1px 3px;
        font-weight: bold;
        color: goldenrod;

        border: .1vw solid goldenrod;
        border-radius: .5vw;
    }

    .small {
        font-size: 1vw;
    }

    .medium {
        font-size: 1.5vw;
    }

    .large {
        font-size: 2vw;
    }
</style>
