<script lang="ts">
    import {store} from "$lib/store/weather.svelte";
    import CardContainer from "$lib/components/card_container.svelte";
</script>

<div class="hoverable weather">
    <CardContainer cards={store.cards}/>
</div>

<style>
    .weather {
        width: 100%;
        height: 100%;
    }
</style>
