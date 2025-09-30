<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import {smallClass} from "$lib/utils";

    type Props = {
        card: CardData;
        isSelectible?: boolean;
        onSelect?: (card: CardData, event: MouseEvent) => void;
        score?: number;
    };
    const {
        card,
        isSelectible,
        onSelect,
        score = card.type === "unit" ? card.strength : 0,
    }: Props = $props();

    const isUnit = $derived(card.type === "unit");
    const isHero = $derived(card.abilities.includes("hero"));

    const handleSelect = $derived((event: MouseEvent) => onSelect?.(card, event));
</script>

<button
    class={{
        hoverable: isSelectible,
        card: true,
    }}
    onclick={handleSelect}
>
    <div class={[smallClass(card), "height"]}></div>
    {#if isUnit}
        <p class={{
            strength: true,
            hero: isHero,
        }}>
            {score}
        </p>
    {/if}
</button>

<style>
    .card {
        height: 95%;
        box-sizing: content-box;
        position: relative;

        &.hoverable:hover {
            margin-bottom: 10px;
        }

    }

    .texture {
        height: 100%;
    }

    .strength {
       position: absolute;
       top: 6%;
       left: 6%;
       width: 25%;
       text-align: center;
       font-size: 0.8vw;
       font-weight: bold;
       color: black;
       z-index: 10;
    }

    .hero {
        color: white;
    }
</style>
