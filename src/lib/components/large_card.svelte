<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import {largeClass} from "$lib/utils";

    type Props = {
        card: CardData;
        size?: "width" | "height";
        onClick?: (card: CardData, event: MouseEvent) => void;
    };
    const {card, size = "height", onClick}: Props = $props();

    const handleClick = $derived((event: MouseEvent) => onClick?.(card, event));
</script>

<button
    class={size}
    onclick={handleClick}
    aria-label={card.name}
>
    <div class={[largeClass(card), size]}></div>
</button>

<style>
    .width {
        width: 100%;
    }

    .height {
        height: 100%;
    }
</style>
