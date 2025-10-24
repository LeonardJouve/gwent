<script lang="ts">
    import {iconURL} from "../utils/utils";
    import {maxSpecialAmountPerDeck, minUnitAmountPerDeck} from "@shared/cards";
    import type {CardData, UnitCardData} from "@shared/types/card";

    type Props = {
        deck: CardData[];
        setIsDeckValid: (isValid: boolean) => void;
    };
    const {deck, setIsDeckValid}: Props = $props();

    const totalAmount = $derived(deck.length);
    const units = $derived(deck.filter((card): card is UnitCardData => card.filename !== "decoy" && card.type === "unit"));
    const unitAmount = $derived(units.length);
    const specialAmount = $derived(totalAmount - unitAmount);
    const heroAmount = $derived(deck.filter((card) => card.abilities.includes("hero")).length);
    const strength = $derived(units.reduce((acc, card) => acc + card.strength, 0));

    const isUnitAmountValid = $derived(unitAmount >= minUnitAmountPerDeck);
    const isSpecialAmountValid = $derived(specialAmount <= maxSpecialAmountPerDeck);
    const isValid = $derived(isUnitAmountValid && isSpecialAmountValid);

    $effect(() => setIsDeckValid(isValid));
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
        <p class={{danger: !isUnitAmountValid}}>
            {`${unitAmount}/${minUnitAmountPerDeck}`}
        </p>
    </div>
    <p>Special Cards</p>
    <div>
        <img
            alt="special"
            src={iconURL("deck_stats_special")}
        />
        <p class={{danger: !isSpecialAmountValid}}>
            {`${specialAmount}/${maxSpecialAmountPerDeck}`}
        </p>
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

        p {
            text-align: center;
            font-size: 1vw;
        }
    }

    .danger {
        color: firebrick;
    }
</style>
