<script lang="ts">
    import {openModal} from "$lib/store/carousel.svelte";
    import {iconURL} from "$lib/utils";
    import type {Faction, FactionName} from "@shared/types/faction";

    type Props = {
        faction: Faction;
        onChangeFaction: (factionName: FactionName) => void;
    };
    const {faction, onChangeFaction}: Props = $props();

    const handleChangeFaction = () => {
        // TODO
        openModal({
            amount: 1,
            isClosable: true,
            onClose: () => onChangeFaction("monsters"),
            cards: [],
        });
    };
</script>

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
        onclick={handleChangeFaction}
    >
        Change Faction
    </button>
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
