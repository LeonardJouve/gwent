<script lang="ts">
    import {largeClass} from "$lib/utils";
    import SoundtrackToggle from "$lib/components/soundtrack_toggle.svelte";
    import DeckStats from "$lib/components/deck_stats.svelte";
    import type {LeaderCardData} from "@shared/types/card";

    type Props = {
        leader: LeaderCardData;
        onQueue: (username: string) => void;
    };
    const {leader, onQueue}: Props = $props();

    let username = $state<string>("");

    const handleQueue = $derived(() => onQueue(username));
</script>

<div class="deck-info">
    <p>Leader</p>
    <div class="leader">
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
