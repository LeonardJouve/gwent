<script>
    import {store} from "../store/game.svelte";
    import LargeCard from "../components/large_card.svelte";
    import CardDescription from "../components/card_description.svelte";

    const selectedCard = $derived(store.selectedIndex === undefined ? undefined : store.players["me"].hand[store.selectedIndex]);
</script>

{#if selectedCard}
    <div class="selected-card">
        <LargeCard card={selectedCard}/>
        <div class="description">
            <CardDescription card={selectedCard}/>
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
