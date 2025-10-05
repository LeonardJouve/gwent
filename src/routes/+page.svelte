<script lang="ts">
    import {onDestroy} from "svelte";
    import cards from "@shared/cards";
    import factions from "$lib/factions";
    import type {Deck} from "@shared/types/deck";
    import {PUBLIC_API_URL} from "$env/static/public";
    import {goto} from "$app/navigation";
    import FactionHeader from "$lib/components/faction_header.svelte";
    import GameCarousel from "$lib/components/game_carousel.svelte";
    import DeckInfo from "$lib/components/deck_info.svelte";
    import CardList from "$lib/components/card_list.svelte";
    import type {CardData, LeaderCardData} from "@shared/types/card";
    import type {FactionName} from "@shared/types/faction";

    let factionName = $state<FactionName>("realms");
    const faction = $derived(factions[factionName]);

    const deck = $state<CardData[]>(cards.slice(0, 20));
    const bank = $derived(cards.filter(({faction, type}) => faction === "neutral" || faction === factionName && type !== "leader"));
    const leader = cards[24] as LeaderCardData;

    const handleChangeFaction = (name: FactionName) => factionName = name;

    let isInQueue = $state<boolean>(false);
    const id = $state<string>(crypto.randomUUID());
    let abortController = $state<AbortController>(new AbortController());

    onDestroy(() => {
        if (!isInQueue) return;
        abortController.abort();
    });

    const handleAbort = () => {
        if (!isInQueue) return;
        isInQueue = false;
        fetch(`${PUBLIC_API_URL}/matchmaking/${id}`, {method: "DELETE"});
    };

    const handleQueue = async (username: string) => {
        if (isInQueue) {
            abortController.abort();
            return;
        }

        try {
            isInQueue = true;
            abortController = new AbortController();
            abortController.signal.addEventListener("abort", handleAbort);

            const res = await fetch(`${PUBLIC_API_URL}/matchmaking/${id}`, {
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
            isInQueue = false;
            goto(`/game?${new URLSearchParams(data).toString()}`);
        } catch (err) {
            isInQueue = false;
        }
    };
</script>

<svelte:window onbeforeunload={handleAbort}/>

<section class="deck-maker">
    <div class="header">
        <h2>Card Collection</h2>
        <FactionHeader
            faction={faction}
            onChangeFaction={handleChangeFaction}
        />
        <h2>Cards in Deck</h2>
    </div>
    <div class="bank">
        <CardList cards={bank}/>
    </div>
    <div class="info">
        <DeckInfo
            leader={leader}
            onQueue={handleQueue}
        />
    </div>
    <div class="deck">
        <CardList cards={deck}/>
    </div>
    <GameCarousel/>
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
        background-color: black;
        opacity: 0.9;
        color: white;
    }

    .bank {
        grid-area: bank;
        display: flex;
        overflow-y: hidden;
    }

    .info {
        grid-area: info;
        display: flex;
        overflow-y: hidden;
    }

    .deck {
        grid-area: deck;
        display: flex;
        overflow-y: hidden;
    }

    .header {
        grid-area: header;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
