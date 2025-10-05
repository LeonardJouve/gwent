<script lang="ts">
    import {largeClass} from "$lib/utils";
    import SoundtrackToggle from "$lib/components/soundtrack_toggle.svelte";
    import DeckStats from "$lib/components/deck_stats.svelte";
    import type {LeaderCardData} from "@shared/types/card";
    import {openModal} from "$lib/store/carousel.svelte";
    import cards from "@shared/cards";

    type Props = {
        leader: LeaderCardData;
        onSelectLeader: (leader: LeaderCardData) => void;
        onQueue: (username: string) => void;
    };
    const {leader, onSelectLeader, onQueue}: Props = $props();

    let username = $state<string>("");

    const handleQueue = $derived(() => onQueue(username));

    const handleSelectLeader = () => {
        const c = cards.filter(({faction, type}) => (faction === "neutral" || faction === leader.faction) && type === "leader");

        openModal({
            amount: 1,
            isClosable: true,
            startIndex: c.findIndex(({filename}) => filename === leader.filename),
            onClose: ([card]) => {
                if (card?.type !== "leader") {
                    return;
                }

                onSelectLeader(card);
            },
            cards: c,
        });
    };
</script>

<div class="deck-info">
    <p>Leader</p>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="leader"
        onclick={handleSelectLeader}
    >
        <div class={[largeClass(leader), "width"]}></div>
    </div>
    <DeckStats/>
    <SoundtrackToggle/>
    <input
        id="username"
        placeholder="Username"
        bind:value={username}
    />
    <button
        id="queue"
        onclick={handleQueue}
    >
        Find match
    </button>
</div>

<style>
    .deck-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        grid-area: info;
        color: tan;
    }

    .queue {
        color: white;
    }

    .leader {
        width: 70%;

        div {
            border-radius: 4%;
        }
    }
</style>
