<script lang="ts">
    import type {CardData} from "$lib/types/card";
    import Card from "$lib/components/card.svelte";

    type Props = {
        cards: CardData[];
        getScore?: (card: CardData) => number;
        onSelect?: (card: CardData) => void;
    };
    const {cards, onSelect, getScore}: Props = $props();
</script>

<div class="container">
    {#each cards as card}
        <Card
            card={card}
            isSelectible={true}
            onSelect={onSelect}
            getScore={getScore}
        />
    {/each}
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 3px;
        padding-bottom: 3px;
    }
</style>
