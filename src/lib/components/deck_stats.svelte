<script lang="ts">
    import {iconURL} from "$lib/utils";
    import type {CardData, UnitCardData} from "@shared/types/card";

    type Props = {
        deck: CardData[];
    };
    const {deck}: Props = $props();

    const totalAmount = $derived(deck.length);
    const units = $derived(deck.filter((card): card is UnitCardData => card.filename !== "decoy" && card.type === "unit"));
    const unitAmount = $derived(units.length);
    const specialAmount = $derived(totalAmount - unitAmount);
    const heroAmount = $derived(deck.filter((card) => card.abilities.includes("hero")).length);
    const strength = $derived(units.reduce((acc, card) => acc + card.strength, 0));
</script>

<div class="deck-stats">
    <p>Total cards in deck</p>
    <div>
        <img
            alt="count"
            src={iconURL("deck_stats_count")}
        />
        <p>{totalAmount}</p>
    </div>
    <p>Number of Unit Cards</p>
    <div>
        <img
            alt="unit"
            src={iconURL("deck_stats_unit")}
        />
        <p>{unitAmount}</p>
    </div>
    <p>Special Cards</p>
    <div>
        <img
            alt="special"
            src={iconURL("deck_stats_special")}
        />
        <p>{specialAmount}/10</p>
    </div>
    <p>Total Unit Card Strength</p>
    <div>
        <img
            alt="strength"
            src={iconURL("deck_stats_strength")}
        />
        <p>{strength}</p>
    </div>
    <p>Hero Cards</p>
    <div>
        <img
            alt="hero"
            src={iconURL("deck_stats_hero")}
        />
        <p>{heroAmount}</p>
    </div>
</div>

<style>
    .deck-stats {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;

        div {
            display: flex;
            gap: 5px;
            align-items: center;
        }

        img {
            width: 2.5vw;
        }
    }
</style>
