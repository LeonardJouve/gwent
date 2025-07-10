<script lang="ts">
    import {store} from "$lib/store/hand.svelte";
    import Card from "./card.svelte";
</script>

<div class="hoverable hand">
    {#each store.cards as card}
        <Card card={card}/>
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
