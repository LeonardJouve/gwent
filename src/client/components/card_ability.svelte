<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import {iconURL} from "../utils/utils";

    type Props = {
        card: CardData;
        size?: "width"|"height";
    };
    const {card, size = "height"}: Props = $props();

    const ability = $derived.by(() => {
        const abilities = card.abilities.filter((ability) => ability !== "hero");
        if (card.type !== "unit" || !abilities.length) {
            return null;
        }

        let abilityName: string = abilities[abilities.length - 1];
        if (abilityName.startsWith("avenger")) {
            abilityName = "avenger";
        } else if (abilityName.startsWith("scorch_")) {
            abilityName = "scorch_row";
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
