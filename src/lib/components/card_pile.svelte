<script lang="ts">
    import type { CardData } from "$lib/types/card";

    type Props = {
        cards: CardData[];
        showCounter?: boolean;
        getSource: (card: CardData, index: number) => string;
    };
    const {cards, showCounter, getSource}: Props = $props();

    const offset = {
        x: -1,
        y: -2,
    };
</script>

<div class="pile">
    {#each cards as card, i}
        <div class="card">
            <img
                alt={card.name}
                src={getSource(card, i)}
                style:transform={`translate(${offset.x * i}px, ${offset.y * i}px)`}>
            />
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

<style>
    .pile {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .card {
        position: absolute;
        height: 100%;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
    }

    img {
        height: 100%;
        box-shadow: -5px -2px 8px rgba(20,20,20, 0.5);
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
