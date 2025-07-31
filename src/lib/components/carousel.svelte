<script lang="ts">
    import LargeCard from "$lib/components/large_card.svelte";
    import type {CardData} from "@shared/types/card";
    import {onMount} from "svelte";
    import CardDescription from "$lib/components/card_description.svelte";

    type Props = {
        onClose: () => void;
        cards: CardData[];
        startIndex?: number;
        onSelect?: (card: CardData) => void;
    };
    const {
        onClose,
        cards,
        startIndex = 0,
        onSelect,
    }: Props = $props();

    let index = $state(startIndex);

    let modal: HTMLDialogElement;

    onMount(() => modal.showModal());

    const leftSlides = $derived(cards.slice(0, index).reverse());
    const currentSlide = $derived(cards[index]);
    const rightSlides = $derived(cards.slice(index + 1));

    const handleClose = $derived(() => {
        onClose();
        modal.close();
    });

    const handleSelect = $derived((card: CardData, event: MouseEvent) => {
        event.stopPropagation();
        onSelect?.(card);
        handleClose();
    });

    const handleBackdropClick = $derived((event: MouseEvent) => {
        event.stopPropagation();
        handleClose();
    });

    const handleClick = (card: CardData, event: MouseEvent) => {
        event.stopPropagation();
        index = cards.findIndex(({id}) => card.id === id);
    };
</script>

{#snippet card(slide: CardData, index: number)}
    <div style:width={`calc(100% / 2 - ${(index + 1) * 5}%)`}>
        <LargeCard
            card={slide}
            size="width"
            onClick={handleClick}
        />
    </div>
{/snippet}

<dialog
    class="modal"
    bind:this={modal}
    onclick={handleBackdropClick}
>
    <div class="carousel">
        <div class="side">
            {#each leftSlides as slide, i}
                {@render card(slide, i)}
            {/each}
        </div>
        <div class="center">
            <LargeCard
                card={currentSlide}
                size="width"
                onClick={handleSelect}
            />
            <div class="description">
                <CardDescription card={currentSlide}/>
            </div>
        </div>
        <div class="side">
            {#each rightSlides as slide, i}
                {@render card(slide, i)}
            {/each}
        </div>
    </div>
</dialog>

<style>
    .modal {
        max-width: none;
        width: 100%;

        &::backdrop {
            background-color: black;
            opacity: 0.3;
        }
    }

    .carousel {
        overflow-x: hidden;
        width: 100%;

        --center-size: 20%;
        --gap: 2vw;

        display: flex;
        gap: var(--gap);

        div {
            display: flex;
            height: 100%;
            overflow-x: hidden;
            align-items: start;
            flex-shrink: 0;
            gap: var(--gap);
        }

        :nth-child(1) {
            flex-direction: row-reverse;
        }
    }

    .center {
        width: var(--center-size);
        justify-content: center;

        .description {
            position: absolute;
            width: 30vw;
            height: unset;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 0%);
        }
    }

    .side {
        width: calc((100% - var(--center-size)) / 2 - var(--gap));
    }
</style>
