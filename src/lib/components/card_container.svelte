<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import Card from "$lib/components/card.svelte";
    import Carousel from "$lib/components/carousel.svelte";

    type Props = {
        cards: CardData[];
        scores?: number[];
        onSelect?: (card: CardData) => void;
        onClick?: () => void;
        canOpenCarousel?: boolean;
    };
    const {
        cards,
        onSelect,
        scores,
        onClick,
        canOpenCarousel = true,
    }: Props = $props();

    let isCarouselOpen = $state(false);
    let selectedIndex = $state(0);

    const handleClick = () => {
        if (canOpenCarousel) {
            handleOpenCarousel();
        }

        onClick?.();
    };

    const handleOpenCarousel = () => isCarouselOpen = true;

    const handleCloseCarousel = (cards: CardData[]) => {
        isCarouselOpen = false;

        if (!cards.length) {
            return;
        }

        const [card] = cards;
        onSelect?.(card);
    };

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
    onclick={handleClick}
>
    {#if isCarouselOpen && cards.length}
        <Carousel
            cards={cards}
            startIndex={selectedIndex}
            onClose={handleCloseCarousel}
            isClosable={true}
        />
    {/if}
    {#each cards as card, i}
        {#key card.name + ":" + i}
            <Card
                card={card}
                isSelectible={true}
                onSelect={handleSelect(i)}
                score={scores?.[i]}
            />
        {/key}
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
