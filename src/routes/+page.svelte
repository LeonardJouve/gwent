<script lang="ts">
    import {onDestroy} from "svelte";
    import {iconURL, largeURL} from "$lib/utils";
    import cards from "@shared/cards";
    import factions from "$lib/factions";
    import type {Deck} from "@shared/types/deck";
    import {PUBLIC_SOCKET_SERVER_URL} from "$env/static/public";
    import {store} from "$lib/store/socket.svelte";
    import {SocketDataSchema} from "@shared/types/socket";
    import {goto} from "$app/navigation";

    const factionName = "realms";
    const faction = factions[factionName];

    const bank = cards.slice(10, 20);
    const deck = cards.slice(0, 10);
    const leader = cards[24];

    let isInQueue = $state<boolean>(false);
    const id = $state<string>(crypto.randomUUID());
    let abortController = $state<AbortController>(new AbortController());
    let username = $state<string>("");

    onDestroy(() => {
        if (!isInQueue) return;
        abortController.abort()
    });

    const handleAbort = () => {
        if (!isInQueue) return;
        isInQueue = false;
        fetch(`${PUBLIC_SOCKET_SERVER_URL}/matchmaking/${id}`, {method: "DELETE"});
    };

    const handleQueue = async (e: MouseEvent) => {
        e.preventDefault();

        if (isInQueue) {
            abortController.abort();
            return;
        }

        try {
            isInQueue = true;
            abortController = new AbortController();
            abortController.signal.addEventListener("abort", handleAbort);

            const res = await fetch(`${PUBLIC_SOCKET_SERVER_URL}/matchmaking/${id}`, {
                method: "POST",
                body: JSON.stringify({
                    name: username,
                    faction: factionName,
                    leader,
                    deck,
                } satisfies Deck),
                signal: abortController.signal,
            });

            if (!res.ok) return;

            const data = await res.json();
            const socketData = SocketDataSchema.parse(data);
            store.data = socketData;
            isInQueue = false;
            goto("/game");
        } catch (err) {
            isInQueue = false;
        }
    };
</script>

<svelte:window onbeforeunload={handleAbort}/>

<section class="deck-maker">
    <div class="header">
        <h2>Card Collection</h2>
        <div class="faction-header">
            <div class="faction-title">
                <img
                    alt={faction.id + " shield"}
                    src={iconURL("deck_shield_" + faction.id)}
                />
                <h1>{faction.name}</h1>
            </div>
            <p class="faction-description">{faction.description}</p>
            <div class="actions">
                <button class="upload">
                    <input type="file"/>
                    Upload Deck
                </button>
                <button>Change Faction</button>
                <button>Download Deck</button>
            </div>
        </div>
        <h2>Cards in Deck</h2>
    </div>
    <div class="card-list">
        {#each bank as card}
            <div
                class="card"
                style={`--count: "${card.maxPerDeck}"`}
            >
                <img
                    alt={card.name}
                    src={largeURL(card)}
                />
            </div>
        {/each}
    </div>
    <div class="deck-info">
        <p>Leader</p>
        <img
            class="leader"
            alt={leader.name + " leader"}
            src={largeURL(leader)}
        >
        <div class="deck-stats">
            <p>Total cards in deck</p>
            <div>
                <img
                    alt="count"
                    src={iconURL("deck_stats_count")}
                />
                <p>0</p>
            </div>
            <p>Number of Unit Cards</p>
            <div>
                <img
                    alt="unit"
                    src={iconURL("deck_stats_unit")}
                />
                <p>0</p>
            </div>
            <p>Special Cards</p>
            <div>
                <img
                    alt="special"
                    src={iconURL("deck_stats_special")}
                />
                <p>0/10</p>
            </div>
            <p>Total Unit Card Strength</p>
            <div>
                <img
                    alt="strength"
                    src={iconURL("deck_stats_strength")}
                />
                <p>0</p>
            </div>
            <p>Hero Cards</p>
            <div>
                <img
                    alt="hero"
                    src={iconURL("deck_stats_hero")}
                />
                <p>0</p>
            </div>
        </div>
        <p class="toggle-music">♫</p>
        <input
            id="username"
            placeholder="Username"
            bind:value={username}
        />
        <button
            id="start-game"
            onclick={handleQueue}
        >
            Find match
        </button>
    </div>
    <div class="card-list">
        {#each deck as card}
            <div
                class="card"
                style={`--count: "${card.maxPerDeck}"`}
            >
                <img
                    alt={card.name}
                    src={largeURL(card)}
                />
            </div>
        {/each}
    </div>
</section>

<style>
    .deck-maker {
        display: grid;
        grid-template-areas:
            "header header header"
            "bank info deck";
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: auto 1fr;
        gap: 10px;
        box-sizing: border-box;
        max-width: 100vw;
        max-height: 100vh;
        padding: 35px 60px 35px 60px;
        /* background-color: rgba(10,10,10,.95); */

    }

    .header {
        grid-area: header;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .faction-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .faction-title {
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

    .actions {
        display: flex;
        gap: 10px;
        .upload input {
            display: none;
        }
    }

    .card-list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        overflow-y: scroll;

        &:nth-child(1) {
            grid-area: bank;
        }

        &:nth-child(3) {
            grid-area: deck;
        }
    }

    .card {
        width: 9.88vw;
        height: 18.45vw;
        position: relative;
        --count: "0";

        img {
            border-radius: 1vw;
            width: 100%;
            height: 100%;
        }

        &::before {
            content: var(--count);
            background-image: url("assets/img/icons/preview_count.png");
            position: absolute;
            top: 82.5%;
            left: 76%;
            width: 20%;
            height: 7%;
            font-size: 1.2vw;
            color: #5f4923;
            padding-left: 1.7vw;
            background-image: url("assets/img/icons/preview_count.png");
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    .deck-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        grid-area: info;
    }

    .deck-stats {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;

        div {
            display: flex;
            gap: 5px;
            align-items: center;
        }

        img {
            width: 2.5vw;
        }
    }

    .leader {
        height: 25vh;
        border-radius: .5vw;
    }

    .toggle-music {
        font-size: 2.5vw;
    }
</style>
