<script lang="ts">
    import LargeCard from "$lib/components/large_card.svelte";
    import type {CardData} from "$lib/types/card";

    type Props = {
        cards: CardData[];
        startIndex?: number;
    };
    const {cards, startIndex = 0}: Props = $props();

    let index = $state(startIndex);

    let modal: HTMLDialogElement;
    let carousel: HTMLDivElement;

    $effect(() => modal.showModal());

    const leftSlides = $derived(cards.slice(0, index).reverse());
    const currentSlide = $derived(cards[index]);
    const rightSlides = $derived(cards.slice(index + 1));

    const handleClick = (card: CardData) => index = cards.findIndex(({id}) => card.id === id);

    const handleBackdropClick = ({target}: MouseEvent) => {
        if (target === modal || target === carousel) {
            modal.close();
        }
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
    <div
        class="carousel"
        bind:this={carousel}
    >
        <div class="side">
            {#each leftSlides as slide, i}
                {@render card(slide, i)}
            {/each}
        </div>
        <div class="slide center">
            <LargeCard
                card={currentSlide}
                size="width"
                onClick={handleClick}
            />
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

        &::backdrop {
            background-color: black;
            opacity: 0.3;
        }
    }

    .carousel {
        overflow: hidden;
        height: 100%;
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
    }

    .side {
        width: calc((100% - var(--center-size)) / 2 - var(--gap));
    }
</style>
