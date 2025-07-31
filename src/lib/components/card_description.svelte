<script lang="ts">
    import type {CardData} from "@shared/types/card";
    import abilities from "$lib/abilities";
    import CardAbility from "$lib/components/card_ability.svelte";

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

{#if card.abilities.length}
    <div class="container">
        <div class="header">
            <div class="ability">
                <CardAbility card={card}/>
            </div>
            <h1 class="name">{name}</h1>
        </div>
        <p class="description">{description}</p>
    </div>
{/if}

<style>
    .container {
        width: 100%;
        height: 100%;
        padding: 0.3vh 0.5vw 0.3vh 0.5vw;
        box-sizing: border-box;

        background-color: rgba(20,20,20, 0.95);
        color: tan;
        text-align: center;
        pointer-events : none;
        border: .1vw solid #ffffff57;
        border-width: .1vw 0;

        display: flex;
        flex-direction: column;
        gap: 0.3vh;
    }

    .header {
        height: 2.5vw;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5vw;
    }

    .ability {
        height: 100%;
    }

    .name {
        font-weight: bold;
        font-size: 1.7vw;
        text-transform: capitalize;
    }
</style>
