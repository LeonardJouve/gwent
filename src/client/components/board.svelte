<script lang="ts">
    import {onMount} from "svelte";
    import {imgURL} from "../utils/utils";
    import type {Rect} from "../types/rect";

    type Props = {
        setBoundingRect?: (rect: Rect) => void;
    };
    const {setBoundingRect}: Props = $props();

    let container: HTMLDivElement;
    let boardImage: HTMLImageElement;

    onMount(() => {
        const observer = new ResizeObserver(() => {
            const imageRatio = boardImage.naturalWidth / boardImage.naturalHeight;
            const viewportRatio = window.innerWidth / window.innerHeight;

            if (imageRatio < viewportRatio) {
                boardImage.style.width = "auto";
                boardImage.style.height = "100%";
            } else {
                boardImage.style.width = "100%";
                boardImage.style.height = "auto";
            }

            setBoundingRect?.(boardImage.getBoundingClientRect());
        });
        observer.observe(boardImage);
        observer.observe(container);

        return () => observer.disconnect();
    });
</script>

<div
    class="container"
    bind:this={container}
>
    <img
        class="board"
        alt="board"
        src={imgURL("board", "jpg")}
        bind:this={boardImage}
    />
</div>

<style>
    .container {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .board {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
