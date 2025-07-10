<script lang="ts">
    import type {CardData} from "$lib/types/card";
    import type {Snippet} from "svelte";

    type Props = {
        cards: CardData[];
        showCounter?: boolean;
        render: Snippet<[CardData, number]>;
    };
    const {cards, showCounter, render}: Props = $props();

    const offset = {
        x: -1,
        y: -2,
    };
</script>

<div class="pile">
    <div class="cards">
        {#each cards as card, i}
            <div
                class="card"
                style:transform={`translate(calc(-50% + ${offset.x * i}px), ${offset.y * i}px)`}
            >
                {@render render(card, i)}
            </div>
        {/each}
        {#if showCounter}
            <div
                class="counter"
                style:transform={`translate(calc(-50% + ${offset.x * cards.length}px), ${offset.y * cards.length}px)`}
            >
                <p>{cards.length}</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .pile {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    }

    .card {
        position: absolute;
        height: 100%;
        bottom: 0px;
        left: 50%;
        box-shadow: -5px -2px 8px rgba(20,20,20, 0.5);
    }

    .cards {
        height: 100%;
        width: 100%;
        position: relative;
    }

    .counter {
        position: absolute;
        bottom: 10px;
        left: 50%;
        padding: 10px 30px 10px 30px;
        font-size: 1.3vw;
        color: tan;
        background-color: rgba(20,20,20, 0.8);
    }
</style>
