<script lang="ts">
    import {store} from "$lib/store/game.svelte";
    import type {PlayerIndicator} from "@shared/types/player";
    import Card from "$lib/components/card.svelte";
    import CardPile from "$lib/components/card_pile.svelte";
    import Carousel from "$lib/components/carousel.svelte";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const grave = $derived(store.players[player].grave);

    let isCarouselOpen = $state(false);

    const handleOpenCarousel = (): void => {
        isCarouselOpen = true;
    };

    const handleCloseCarousel = (): void => {
        isCarouselOpen = false;
    };
</script>

{#snippet card(i: number)}
    <Card card={grave[i]}/>
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
        cardAmount={grave.length}
        render={card}
    />
</div>

<style>
    .grave {
        width: 100%;
        height: 100%;
    }
</style>
