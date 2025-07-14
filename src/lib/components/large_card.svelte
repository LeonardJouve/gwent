<script lang="ts">
    import type {CardData} from "$lib/types/card";
    import {largeURL} from "$lib/utils";

    type Props = {
        card: CardData;
        size?: "width" | "height";
        onClick?: (card: CardData) => void;
    };
    const {card, size = "height", onClick}: Props = $props();

    const handleClick = $derived(() => onClick?.(card));
</script>

<button onclick={handleClick}>
    <img
        class={{
            height: size === "height",
            width: size === "width",
        }}
        alt={card.name}
        src={largeURL(card)}
    />
</button>

<style>
    .width {
        width: 100%;
    }

    .height {
        height: 100%;
    }
</style>
