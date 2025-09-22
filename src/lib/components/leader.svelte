<script lang="ts">
    import {store} from "$lib/store/game.svelte";
    import {store as carouselStore} from "$lib/store/carousel.svelte";
    import type {PlayerIndicator} from "@shared/types/player";
    import Card from "$lib/components/card.svelte";
    import {iconURL} from "$lib/utils";
    import type {CardData} from "@shared/types/card";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const playerData = $derived(store.players[player]);

    const handleSelect = (card: CardData) => {
        if (!playerData.isLeaderAvailable || store.turn !== "me" || !store.askPlay) {
            return;
        }

        carouselStore.amount = 1;
        carouselStore.onClose = (cards) => {
            if (!cards.length || !store.askPlay) {
                return;
            }

            store.askPlay({type: "leader"});
        };
        carouselStore.isClosable = true;
        carouselStore.cards = [card];
        carouselStore.isOpen = true;
    };
</script>

<div class="leader">
    {#if playerData.leader}
        <Card
            card={playerData.leader}
            isSelectible={playerData.isLeaderAvailable}
            onSelect={handleSelect}
        />
    {/if}
    {#if playerData.isLeaderAvailable}
        <img
            class="status"
            alt="active"
            src={iconURL("icon_leader_active")}
        />
    {/if}
</div>

<style>
    .leader {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: end;
        position: relative;
    }

    .status {
        position: absolute;
        right: -14%;
        top: 50%;
        height: 30%;
        transform: translate(100%, -50%);
    }
</style>
