<script lang="ts">
    import {largeClass} from "../utils/utils";
    import SoundtrackToggle from "../components/soundtrack_toggle.svelte";
    import DeckStats from "../components/deck_stats.svelte";
    import type {CardData, LeaderCardData} from "@shared/types/card";
    import {openCarousel} from "../store/carousel.svelte";
    import {cardsArray} from "@shared/cards";
    import {getLastUsername, setLastUsername} from "../utils/local_storage";

    type Props = {
        leader: LeaderCardData;
        deck: CardData[];
        isInQueue: boolean;
        onSelectLeader: (leader: LeaderCardData) => void;
        onQueue: (username: string) => void;
    };
    const {leader, deck, isInQueue, onSelectLeader, onQueue}: Props = $props();

    let username = $state<string>(getLastUsername() ?? "");
    let isDeckValid = $state<boolean>(false);

    const handleIsDeckValid = (isValid: boolean) => isDeckValid = isValid;

    const handleQueue = (e: SubmitEvent) => {
        e.preventDefault();
        onQueue(username);
    };

    const handleSelectLeader = () => {
        const cards = cardsArray.filter(({faction, type}) => (faction === "neutral" || faction === leader.faction) && type === "leader");

        openCarousel({
            isClosable: true,
            startIndex: cards.findIndex(({filename}) => filename === leader.filename),
            onClose: (selection) => {
                if (selection?.item.type !== "leader") {
                    return;
                }

                onSelectLeader(selection.item);
            },
            cards,
        });
    };

    const handleUsername = (e: Event) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }

        setLastUsername(e.target.value);
    };
</script>

<div class="deck-info">
    <div class="stats">
        <p>Leader</p>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            onclick={handleSelectLeader}
            class={[largeClass(leader), "leader"]}
        ></div>
        <DeckStats
            deck={deck}
            setIsDeckValid={handleIsDeckValid}
        />
    </div>
    <SoundtrackToggle/>
    <form
        class="form"
        onsubmit={handleQueue}
    >
        <input
            id="username"
            required={true}
            placeholder="Username"
            bind:value={username}
            oninput={handleUsername}
        />
        <button
            type="submit"
            class="queue"
            disabled={!isDeckValid}
        >
            {isInQueue ? "Waiting...": "Find match"}
        </button>
    </form>
</div>

<style>
    .deck-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        color: tan;
        height: 100%;
    }

    .queue {
        color: white;
        font-size: larger;
    }

    .leader {
        width: 50%;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .stats {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        width: 100%;
        gap: 10px;
    }
</style>
