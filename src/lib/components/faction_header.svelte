<script lang="ts">
    import {iconURL} from "$lib/utils";
    import {FactionNameSchema, type Faction, type FactionName} from "@shared/types/faction";
    import Carousel from "$lib/components/carousel.svelte";

    type Props = {
        faction: Faction;
        onChangeFaction: (factionName: FactionName) => void;
    };
    const {faction, onChangeFaction}: Props = $props();

    let isCarouselOpen = $state(false);

    const factions = FactionNameSchema.options;
    const selectedFactionIndex = $derived(factions.findIndex((f) => faction.id === f));

    const handleOpenCarousel = () => isCarouselOpen = true;

    const handleCloseCarousel = ([newFaction]: FactionName[]) => {
        isCarouselOpen = false;

        if (!newFaction) {
            return;
        }

        onChangeFaction(newFaction);
    };
</script>

{#snippet render(faction: FactionName, _: boolean, onClick: (event: MouseEvent) => void)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class={[`lg-back-${faction}`, "width"]}
        onclick={onClick}
    ></div>
{/snippet}

<div class="header">
    <div class="title">
        <img
            alt={faction.id + " shield"}
            src={iconURL("deck_shield_" + faction.id)}
        />
        <h1>{faction.name}</h1>
    </div>
    <p class="description">{faction.description}</p>
    <button
        class="change"
        onclick={handleOpenCarousel}
    >
        Change Faction
    </button>
    {#if isCarouselOpen}
        <Carousel
            isClosable={true}
            startIndex={selectedFactionIndex}
            items={factions}
            onClose={handleCloseCarousel}
            render={render}
        />
    {/if}
</div>

<style>
    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        text-transform: capitalize;
        height: 50px;

        img {
            height: 100%;
        }
    }

    .description {
        color: tan;
    }

    .change {
        color: white;
    }
</style>
