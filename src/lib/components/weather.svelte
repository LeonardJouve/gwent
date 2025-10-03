<script lang="ts">
    import CardContainer from "./card_container.svelte";
    import {store} from "$lib/store/game.svelte";
</script>

<div class="hoverable weather">
    <CardContainer cards={store.board.weather}/>
</div>

<style>
    .weather {
        width: 100%;
        height: 100%;
    }
</style>
