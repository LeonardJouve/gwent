<script lang="ts">
    import {onMount} from "svelte";

    type Rect = {
        top: number;
        left: number;
        width: number;
        height: number;
    };

    let boardImage: HTMLImageElement;
    let boardBoundingRect = $state<Rect>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    onMount(() => {
        function resizeImage() {
            const imageRatio = boardImage.naturalWidth / boardImage.naturalHeight;
            const viewportRatio = window.innerWidth / window.innerHeight;

            if (imageRatio < viewportRatio) {
                boardImage.style.width = "auto";
                boardImage.style.height = "100%";
            } else {
                boardImage.style.width = "100%";
                boardImage.style.height = "auto";
            }

            boardBoundingRect = boardImage.getBoundingClientRect();
        }

        resizeImage();
        window.addEventListener("resize", resizeImage);
        return () => window.removeEventListener("resize", resizeImage);
    });

    const getRowPosition = $derived((index: number) => {
        const verticalPositions = [
            1.4,
            13.8,
            26.4,
            40.3,
            52.7,
            65.3,
        ];
        const horizontalPosition = 36.9;
        const widthPercent = 42;
        const heightPercent = 10.8;

        const horizontalPercent = boardBoundingRect.width / 100;
        const verticalPercent = boardBoundingRect.height / 100;
        const left = `left: ${boardBoundingRect.left + (horizontalPosition * horizontalPercent)}px`;
        const top = `top: ${boardBoundingRect.top + (verticalPositions[index] * verticalPercent)}px`;
        const width = `width: ${widthPercent * horizontalPercent}px`;
        const height = `height: ${heightPercent * verticalPercent}px`;
        return [left, top, width, height].join("; ");
    });
</script>

<div class="game">
    <img
        class="board"
        alt="board"
        src="assets/img/board.jpg"
        bind:this={boardImage}
    />

    {#each {length: 6}, i}
        <div class="row" style={getRowPosition(i)}></div>
    {/each}

</div>

<style>
    .game {
        width: 100vw;
        height: 100vh;
        position: relative;
        background-color: rgba(10,10,10,.95);
    }

    .board {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .row {
        border: solid 2px goldenrod;
        background-color: rgba(218, 165, 32, 0.1);
        position: absolute;
    }
</style>
