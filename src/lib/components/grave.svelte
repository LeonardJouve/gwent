<script lang="ts">
    import {store} from "$lib/store/game.svelte";
    import type {CardData} from "$lib/types/card";
    import type {Player} from "$lib/types/player";
    import Card from "$lib/components/card.svelte";
    import CardPile from "$lib/components/card_pile.svelte";
    import Carousel from "$lib/components/carousel.svelte";

    type Props = {
        player: Player;
    };
    const {player}: Props = $props();

    const grave = $derived(store.playerDatas[player].grave);

    let isCarouselOpen = $state(false);

    const handleOpenCarousel = () => isCarouselOpen = true;

    const handleCloseCarousel = () => isCarouselOpen = false;
</script>

{#snippet card(card: CardData)}
    <Card card={card}/>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="grave hoverable"
    onclick={handleOpenCarousel}
>
    {#if isCarouselOpen && grave.length}
        <Carousel
            cards={grave}
            onClose={handleCloseCarousel}
        />
    {/if}
    <CardPile
        cards={grave}
        render={card}
    />
</div>

<style>
    .grave {
        width: 100%;
        height: 100%;
    }
</style>
