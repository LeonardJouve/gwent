<script lang="ts">
    import Carousel from "$lib/components/carousel.svelte";
    import LargeCard from "$lib/components/large_card.svelte";
    import CardDescription from "$lib/components/card_description.svelte";
    import {type CardData} from "@shared/types/card";

    type Props = {
        onClose: (cards: CardData[]) => void;
        cards: CardData[];
        isClosable?: boolean;
        startIndex?: number;
        amount?: number;
    };
    const {cards, ...props}: Props = $props();
</script>

{#snippet render(slide: CardData, isCenter: boolean, onClick: (event: MouseEvent) => void)}
    {#if isCenter}
        <div class="container">
            <LargeCard
                card={slide}
                size="width"
                onClick={onClick}
            />
            <div class="desc">
                <CardDescription card={slide}/>
            </div>
        </div>

        <style>
            .container {
                width: 100%;
            }

            .desc {
                position: absolute;
                width: 30vw;
                height: unset;
                bottom: 0;
                left: 50%;
                transform: translate(-50%, 0%);
            }
        </style>
    {:else}
        <LargeCard
            card={slide}
            size="width"
            onClick={onClick}
        />
    {/if}
{/snippet}

<Carousel
    render={render}
    items={cards}
    {...props}
/>
