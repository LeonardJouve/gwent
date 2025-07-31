<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import Card from "$lib/components/card.svelte";
    import Carousel from "$lib/components/carousel.svelte";

    type Props = {
        cards: CardData[];
        getScore?: (card: CardData) => number;
        onSelect?: (card: CardData) => void;
    };
    const {cards, onSelect, getScore}: Props = $props();

    let isCarouselOpen = $state(false);
    let selectedIndex = $state(0);

    const handleOpenCarousel = () => isCarouselOpen = true;

    const handleCloseCarousel = () => isCarouselOpen = false;

    const handleSelect = $derived((index: number) => (card: CardData, event: MouseEvent) => {
        if (onSelect) {
            event.stopPropagation();
            onSelect(card);
            return;
        }

        selectedIndex = index;
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="container"
    onclick={handleOpenCarousel}
>
    {#if isCarouselOpen && cards.length}
        <Carousel
            cards={cards}
            startIndex={selectedIndex}
            onSelect={onSelect}
            onClose={handleCloseCarousel}
        />
    {/if}
    {#each cards as card, i}
        <Card
            card={card}
            isSelectible={true}
            onSelect={handleSelect(i)}
            getScore={getScore}
        />
    {/each}
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 3px;
        padding-bottom: 3px;
    }
</style>
