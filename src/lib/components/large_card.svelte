<script lang="ts">
    import type {CardData} from "$lib/types/card";
    import {largeURL} from "$lib/utils";

    type Props = {
        card: CardData;
    };
    const {card}: Props = $props();
</script>

<img
    class="card"
    alt={card.name}
    src={largeURL(card)}
/>

<style>
    .card {
        height: 100%;
    }
</style>
