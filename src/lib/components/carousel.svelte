<script lang="ts" generics="T = CardData">
    import type {CardData} from "@shared/types/card";
    import {onMount, type Snippet} from "svelte";

    type Props = {
        onClose: (items: T[]) => void;
        items: T[];
        isClosable?: boolean;
        startIndex?: number;
        amount?: number;
        render: Snippet<[slide: T, isCenter: boolean, onClick: (event: MouseEvent, item: T) => void]>;
    };
    const {
        onClose,
        items,
        isClosable,
        render,
        amount = 1,
        startIndex = 0,
    }: Props = $props();

    let index = $state(startIndex);
    const selectedItems = $state<T[]>([]);

    let modal: HTMLDialogElement;

    onMount(() => modal.showModal());

    const leftSlides = $derived(items.slice(0, index).reverse());
    const currentSlide = $derived(items[index]);
    const rightSlides = $derived(items.slice(index + 1));

    const handleClose = $derived(() => {
        onClose(selectedItems);
        modal.close();
    });

    const handleSelect = $derived((event: MouseEvent, item: T) => {
        event.stopPropagation();
        selectedItems.push(item);

        if (selectedItems.length === amount) {
            handleClose();
        }
    });

    const handleBackdropClick = $derived((event: MouseEvent) => {
        event.stopPropagation();

        if (isClosable) {
            handleClose();
        }
    });

    const handleClick = (event: MouseEvent, _: T, i: number) => {
        event.stopPropagation();
        index = i;
    };
</script>

<dialog
    class="modal"
    bind:this={modal}
    onclick={handleBackdropClick}
>
    <div class="carousel">
        <div class="side">
            {#each leftSlides as slide, i}
                <div
                    class="slide"
                    style:width={`calc(100% / 2 - ${(i + 1) * 5}%)`}
                >
                    {@render render(slide, false, (event, item) => handleClick(event, item, leftSlides.length - i - 1))}
                </div>
            {/each}
        </div>
        <div class="center">
            {@render render(currentSlide, true, handleSelect)}
        </div>
        <div class="side">
            {#each rightSlides as slide, i}
                <div
                    class="slide"
                    style:width={`calc(100% / 2 - ${(i + 1) * 5}%)`}
                >
                    {@render render(slide, false, (event, item) => handleClick(event, item, leftSlides.length + i + 1))}
                </div>
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

        > div {
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

    .slide {
        flex-shrink: 0;
    }
</style>
