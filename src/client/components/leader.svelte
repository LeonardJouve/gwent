<script lang="ts">
    import {store} from "../store/game.svelte";
    import {openModal, type Modal} from "../store/carousel.svelte";
    import type {PlayerIndicator} from "@shared/types/player";
    import Card from "../components/card.svelte";
    import {iconURL} from "../utils/utils";
    import type {CardData} from "@shared/types/card";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const playerData = $derived(store.players[player]);

    const handleSelect = (card: CardData) => {
        openModal({
            amount: 1,
            isClosable: true,
            cards: [card],
            onClose: () => {
                if (player !== "me" || store.turn !== "me" || !store.askPlay) {
                    return;
                }

                store.askPlay({type: "leader"});
            },
        });
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
