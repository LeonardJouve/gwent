<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import {largeClass} from "../utils/utils";

    type Props = {
        card: CardData;
        size?: "width" | "height";
        onClick?: (event: MouseEvent, card: CardData) => void;
    };
    const {card, size = "height", onClick}: Props = $props();

    const handleClick = $derived((event: MouseEvent) => onClick?.(event, card));
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
