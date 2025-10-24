<script lang="ts">
    import {backClass, iconURL} from "../utils/utils";
    import {FactionNameSchema, type Faction, type FactionName} from "@shared/types/faction";
    import Carousel from "../components/carousel.svelte";
    import Description from "./description.svelte";
    import factions from "@shared/factions";
    import type {CarouselSelection} from "@shared/types/socket";

    type Props = {
        faction: Faction;
        onChangeFaction: (factionName: FactionName) => void;
    };
    const {faction, onChangeFaction}: Props = $props();

    let isCarouselOpen = $state(false);

    const factionNames = FactionNameSchema.options;
    const selectedFactionIndex = $derived(factionNames.findIndex((f) => faction.id === f));

    const handleOpenCarousel = () => isCarouselOpen = true;

    const handleCloseCarousel = (selection: CarouselSelection<FactionName>|null) => {
        isCarouselOpen = false;

        if (!selection) {
            return;
        }

        onChangeFaction(selection.item);
    };
</script>

{#snippet renderHeader(faction: Faction)}
    <h2>{faction.name}</h2>
{/snippet}

{#snippet renderDescription(faction: Faction)}
    <p>{faction.description}</p>
{/snippet}

{#snippet render(faction: FactionName, isCenter: boolean, onClick: (event: MouseEvent) => void)}
    {#if isCenter}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div style:width="100%">
            <div
                class={[backClass(faction), "width"]}
                onclick={onClick}
            ></div>
            <div class="desc">
                <Description
                    element={factions[faction]}
                    renderHeader={renderHeader}
                    renderDescription={renderDescription}
                />
            </div>
        </div>

        <style>
            .desc {
                position: absolute;
                width: 30vw;
                height: unset;
                bottom: 0;
                left: 50%;
                transform: translate(-50%, 0%);
            }
        </style>
    {:else}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class={[backClass(faction), "width"]}
            onclick={onClick}
        ></div>
    {/if}
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
            items={factionNames}
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
