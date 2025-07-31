<script lang="ts">
    import CardContainer from "$lib/components/card_container.svelte";
    import {store} from "$lib/store/game.svelte";
    import type {CardData} from "@shared/types/card";

    const handleSelect = $derived((card: CardData) => store.selectedCard = card);
    const hand = $derived(store.playerDatas["me"].hand);
</script>

<div class="hoverable hand">
    <CardContainer
        cards={hand}
        onSelect={handleSelect}
    />
</div>

<style>
    .hand {
        width: 100%;
        height: 100%;
    }
</style>
