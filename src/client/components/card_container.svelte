<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import Card from "../components/card.svelte";
    import {openCarousel} from "../store/carousel.svelte";

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

    const handleClick = () => {
        if (canOpenCarousel) {
            handleOpenCarousel();
        }

        onClick?.();
    };

    const handleOpenCarousel = (index?: number) => openCarousel({
        cards,
        amount: 1,
        startIndex: index,
        isClosable: true,
        onClose: (cards: CardData[]) => {
            if (!cards.length) {
                return;
            }

            const [card] = cards;
            onSelect?.(card);
        },
    });

    const handleSelect = $derived((index: number) => (card: CardData, event: MouseEvent) => {
        event.stopPropagation();

        if (onSelect) {
            onSelect(card);
            return;
        }

        handleOpenCarousel(index);
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="container"
    onclick={handleClick}
>
    {#each cards as card, i}
        {#key card.filename + ":" + i}
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
