<script lang="ts">
    import type {CardData} from "$lib/types/card";
    import {iconURL, smallURL} from "$lib/utils";

    type Props = {
        card: CardData;
        isSelectible?: boolean;
    }
    const {card, isSelectible = true}: Props = $props();

    const abilities = $derived(card.ability.split(" "));
    const isUnit = $derived(card.row === "close" || card.row === "ranged" || card.row === "siege" || card.row === "agile");
    const isHero = $derived(abilities[0] === "hero");

    const power = $derived.by(() => {
        if (card.row === "leader") {
            return null;
        } else if (isHero) {
            return "power_hero";
        } else if (card.deck === "weather" || card.deck === "special") {
            return "power_" + abilities[0];
        } else {
            return "power_normal";
        }
    });

    const ability = $derived.by(() => {
        if (card.deck !== "special" && card.deck !== "weather" && abilities.length > 0) {
            let abilityName = abilities[abilities.length - 1];
            if (abilityName.startsWith("avenger")) {
                abilityName = "avenger";
            } else if (abilityName.startsWith("scorch")) {
                abilityName = "scorch";
            }

            return "card_ability_" + abilityName;
        } else if (card.row === "agile") {
            return "card_ability_agile";
        }

        return null;
    });
</script>

<div class={{
    hoverable: isSelectible,
    card: true,
}}>
    <img
        class="texture"
        alt={card.name}
        src={smallURL(card)}
    />
    {#if power !== null}
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
            {card.strength}
        </p>
    {/if}
    <div class="abilities">
        {#if ability !== null}
            <img
                alt={ability}
                src={iconURL(ability)}
            />
        {/if}
        {#if isUnit}
            <img
                alt={card.row}
                src={iconURL("card_row_" + card.row)}
            />
        {/if}
    </div>
</div>

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

            img {
                width: 33%;
            }
        }

        .power {
            position: absolute;
            top: -2%;
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
