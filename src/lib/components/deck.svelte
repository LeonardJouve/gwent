<script lang="ts">
    import type {PlayerIndicator} from "@shared/types/player";
    import CardPile from "$lib/components/card_pile.svelte";
    import {store} from "$lib/store/game.svelte";
    import {iconURL} from "$lib/utils";
    import type {CardData} from "@shared/types/card";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const playerData = $derived(store.playerDatas[player]);
</script>

{#snippet cardBack(card: CardData)}
    <img
        alt={card.name}
        src={iconURL("deck_back_" + playerData.faction, "jpg")}
        style:height="100%"
    />
{/snippet}

<CardPile
    cards={playerData.cards}
    showCounter={true}
    render={cardBack}
/>
