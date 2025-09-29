<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import {iconURL} from "$lib/utils";

    type Props = {
        card: CardData;
        size?: "width"|"height";
    };
    const {card, size = "height"}: Props = $props();

    const ability = $derived.by(() => {
        if (card.type !== "unit" || !card.abilities.filter((ability) => ability !== "hero").length) {
            return null;
        }

        let abilityName = card.abilities[card.abilities.length - 1];
        if (abilityName.startsWith("avenger")) {
            abilityName = "avenger";
        } else if (abilityName.startsWith("scorch")) {
            abilityName = "scorch";
        }

        return "card_ability_" + abilityName;
    });
</script>

{#if ability}
    <img
        class={size}
        alt={ability}
        src={iconURL(ability)}
    />
{/if}

<style>
    .width {
        width: 100%;
    }

    .height {
        height: 100%;
    }
</style>
