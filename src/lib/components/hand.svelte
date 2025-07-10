<script lang="ts">
    import CardContainer from "$lib/components/card_container.svelte";
    import {store} from "$lib/store/deck.svelte";
</script>

<CardContainer cards={store["me"].hand}/>
