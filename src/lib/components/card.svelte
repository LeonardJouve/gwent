<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import {iconURL, smallURL} from "$lib/utils";
    import CardAbility from "$lib/components/card_ability.svelte";

    type Props = {
        card: CardData;
        isSelectible?: boolean;
        onSelect?: (card: CardData, event: MouseEvent) => void;
        getScore?: (card: CardData) => number;
    };
    const {
        card,
        isSelectible,
        onSelect,
        getScore = (card) => card.strength,
    }: Props = $props();

    const isUnit = $derived(card.row === "close" || card.row === "ranged" || card.row === "siege" || card.row === "agile");
    const isHero = $derived(card.abilities.includes("hero"));

    const power = $derived.by(() => {
        if (card.abilities.includes("leader")) {
            return null;
        } else if (isHero) {
            return "power_hero";
        } else if (card.deck === "weather" || card.deck === "special") {
            return "power_" + card.abilities[0];
        } else {
            return "power_normal";
        }
    });

    const handleSelect = $derived((event: MouseEvent) => onSelect?.(card, event));
</script>

<button
    class={{
        hoverable: isSelectible,
        card: true,
    }}
    onclick={handleSelect}
>
    <img
        class="texture"
        alt={card.name}
        src={smallURL(card)}
    />
    {#if power}
        <img
            class="power"
            alt="power"
            src={iconURL(power)}
        />
    {/if}
    {#if isUnit}
        <p class={{
            strength: true,
            hero: isHero,
        }}>
            {getScore(card)}
        </p>
    {/if}
    <div class="abilities">
        <div>
            <CardAbility
                card={card}
                size="width"
            />
        </div>
        {#if isUnit}
            <img
                alt={card.row}
                src={iconURL("card_row_" + card.row)}
            />
        {/if}
    </div>
</button>

<style>
    .card {
        height: 95%;
        box-sizing: content-box;
        position: relative;

        &.hoverable:hover {
            margin-bottom: 10px;
        }

        .texture {
            height: 100%;
        }

        .abilities {
            position: absolute;
            bottom: 0px;
            right: 0px;
            width: 100%;
            padding-bottom: 3px;
            padding-right: 3px;
            display: flex;
            justify-content: end;
            gap: 3px;

            * {
                width: 33%;
            }
        }

        .power {
            position: absolute;
            top: -2.2%;
            left: -4%;
            width: 70%;
        }

        .strength {
           position: absolute;
           top: 6%;
           left: 6%;
           width: 25%;
           text-align: center;
           font-size: 0.8vw;
           font-weight: bold;
           color: black;
           z-index: 10;
        }

        .hero {
            color: white;
        }
    }
</style>
