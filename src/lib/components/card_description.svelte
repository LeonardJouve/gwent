<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import abilities from "$lib/abilities";
    import CardAbility from "$lib/components/card_ability.svelte";
    import Description from "./description.svelte";

    type Props = {
        card: CardData;
    };
    const {card}: Props = $props();

    const name = $derived.by(() => {
        if (!card.abilities.length) {
            return null;
        }

        return abilities[card.abilities[card.abilities.length - 1]].name;
    });

    const description = $derived.by(() => card.abilities
        .map((ability) => abilities[ability].description)
        .reverse()
        .join(""));
</script>

{#snippet renderHeader()}
    <CardAbility
        card={card}
        size="height"
    />
    <h2>{name}</h2>
{/snippet}

{#snippet renderDescription()}
    <p>{description}</p>
{/snippet}

{#if card.abilities.length}
    <Description
        element={null}
        renderHeader={renderHeader}
        renderDescription={renderDescription}
    />
{/if}
