<script lang="ts">
    import {store} from "$lib/store/weather.svelte";
    import CardContainer from "$lib/components/card_container.svelte";
</script>

<CardContainer cards={store.cards}/>
