<script lang="ts">
    import type {CardData} from "$lib/types/card";
    import Card from "$lib/components/card.svelte";

    type Props = {
        cards: CardData[];
        getScore?: (card: CardData) => number;
    };
    const {cards, getScore}: Props = $props();
</script>

<div class="hoverable hand">
    {#each cards as card}
        <Card
            card={card}
            isSelectible={true}
            getScore={getScore}
        />
    {/each}
</div>

<style>
    .hand {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 3px;
        padding-bottom: 3px;
    }
</style>
