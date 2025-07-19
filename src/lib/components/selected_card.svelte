<script>
    import {store} from "$lib/store/game.svelte";
    import LargeCard from "$lib/components/large_card.svelte";
    import CardDescription from "$lib/components/card_description.svelte";

    const card = $derived(store.selectedCard);
</script>

{#if card}
    <div class="selected-card">
        <LargeCard card={card}/>
        <div class="description">
            <CardDescription card={card}/>
        </div>
    </div>
{/if}

<style>
    .selected-card {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3vh 2vw 3vh 2vw;
        box-sizing: border-box;
    }

    .description {
        position: absolute;
        bottom: 0;
        transform: translateY(100%);
    }
</style>
