<script lang="ts">
    import Carousel from "../components/carousel.svelte";
    import LargeCard from "../components/large_card.svelte";
    import CardDescription from "../components/card_description.svelte";
    import type {CardData} from "@shared/types/card";
    import type {CardSelection} from "@shared/types/socket";

    type Props = {
        onClose: (selection: CardSelection|null) => void;
        cards: CardData[];
        isClosable?: boolean;
        startIndex?: number;
    };
    const {cards, ...props}: Props = $props();
</script>

{#snippet render(slide: CardData, isCenter: boolean, onClick: (event: MouseEvent) => void)}
    {#if isCenter}
        <div style:width="100%">
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
