<script lang="ts" generics="T = CardData">
    import {onMount, type Snippet} from "svelte";
    import type {CardData} from "@shared/types/card";
    import type {CarouselSelection} from "@shared/types/socket";

    type Props = {
        onClose: (selection: CarouselSelection<T>|null) => void;
        items: T[];
        isClosable?: boolean;
        startIndex?: number;
        amount?: number;
        render: Snippet<[slide: T, isCenter: boolean, onClick: (event: MouseEvent) => void]>;
    };
    const {
        onClose,
        items,
        isClosable,
        render,
        startIndex = 0,
    }: Props = $props();

    let index = $state(startIndex);

    let modal: HTMLDialogElement;

    onMount(() => modal.showModal());

    const leftSlides = $derived(items.slice(0, index).reverse());
    const currentSlide = $derived(items[index]);
    const rightSlides = $derived(items.slice(index + 1));

    const handleClose = $derived((selection: CarouselSelection<T>|null) => {
        onClose(selection);
        modal.close();
    });

    const handleSelect = $derived((event: Event) => {
        event.stopPropagation();
        handleClose({
            item: currentSlide,
            index,
        });
    });

    const handleBackdropClick = $derived((event: Event) => {
        event.stopPropagation();

        if (isClosable) {
            handleClose(null);
        }
    });

    const handleClick = (event: Event, i: number) => {
        event.stopPropagation();
        index = i;
    };

    const handleLeft = () => {
        if (index <= 0) {
            return;
        }

        --index;
    };

    const handleRight = () => {
        if (index >= items.length - 1) {
            return;
        }

        ++index;
    };

    const handleKeydown = (event: KeyboardEvent) => {
        switch (event.key) {
        case "ArrowLeft":
            event.preventDefault();
            handleLeft();
            break;
        case "ArrowRight":
            event.preventDefault();
            handleRight();
            break;
        case " ":
        case "Spacebar":
            event.preventDefault();
            handleSelect(event);
            break;
        case "Escape":
            event.preventDefault();
            handleBackdropClick(event);
            break;
        }
    };

    const handleWheel = (event: WheelEvent) => {
        event.stopPropagation();

        if (event.deltaY > 0) {
            handleLeft();
        } else {
            handleRight();
        }
    };
</script>

<svelte:window onkeydown={handleKeydown}/>

<dialog
    class="modal"
    bind:this={modal}
    onclick={handleBackdropClick}
    onwheel={handleWheel}
>
    <div class="carousel">
        <div class="side">
            {#each leftSlides as slide, i}
                <div
                    class="slide"
                    style:width={`calc(100% / 2 - ${(i + 1) * 5}%)`}
                >
                    {@render render(slide, false, (event) => handleClick(event, leftSlides.length - i - 1))}
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
                    {@render render(slide, false, (event) => handleClick(event, leftSlides.length + i + 1))}
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
