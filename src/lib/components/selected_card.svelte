<script>
    import {store} from "$lib/store/selected_card.svelte";
    import LargeCard from "./large_card.svelte";

    const card = $derived(store.card);
</script>

{#if card}
    <div class="selected-card">
        <LargeCard card={card}/>
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
</style>
