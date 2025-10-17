<script lang="ts">
    import {onDestroy} from "svelte";
    import {navigate} from "svelte5-router";
    import cards from "@shared/cards";
    import factions from "@shared/factions";
    import type {Deck} from "@shared/types/deck";
    import FactionHeader from "../components/faction_header.svelte";
    import GameCarousel from "../components/game_carousel.svelte";
    import DeckInfo from "../components/deck_info.svelte";
    import CardList from "../components/card_list.svelte";
    import type {CardData, LeaderCardData} from "@shared/types/card";
    import type {FactionName} from "@shared/types/faction";
    import {getCardsWithAmount, getPremadeDeck, getPremadeLeader, sortCards} from "../utils/utils";

    const defaultFactionName = "realms";
    let factionName = $state<FactionName>(defaultFactionName);
    const faction = $derived(factions[factionName]);

    let leader = $state<LeaderCardData>(getPremadeLeader(defaultFactionName));
    let deck = $state<CardData[]>(getPremadeDeck(defaultFactionName));
    const bank = $derived.by(() => {
        const deckCardsWithAmount = getCardsWithAmount(deck);

        return sortCards(cards
            .filter(({faction, type}) => (faction === "neutral" || faction === factionName) && type !== "leader")
            .flatMap((card) => Array.from({length: card.maxPerDeck - (deckCardsWithAmount.get(card.filename)?.amount ?? 0)}, () => card)));
    });

    const handleChangeFaction = (name: FactionName) => {
        factionName = name;
        deck = getPremadeDeck(factionName);
        leader = getPremadeLeader(factionName);
    };

    const handleAddToDeck = (card: CardData): void => {
        deck.push(card);
        sortCards(deck);
    };

    const handleRemoveFromDeck = (card: CardData): void => {
        const index = deck.findIndex(({filename}) => card.filename === filename);
        if (index === -1) {
            return;
        }

        deck.splice(index, 1);
    };

    const handleSelectLeader = (newLeader: LeaderCardData) => leader = newLeader;

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
        fetch(`${import.meta.env.VITE_API_URL}/matchmaking/${id}`, {method: "DELETE"});
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

            const res = await fetch(`${import.meta.env.VITE_API_URL}/matchmaking/${id}`, {
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

            navigate(`/game?${new URLSearchParams(data).toString()}`);
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
        <CardList
            cards={bank}
            onClick={handleAddToDeck}
        />
    </div>
    <div class="info">
        <DeckInfo
            leader={leader}
            deck={deck}
            onSelectLeader={handleSelectLeader}
            onQueue={handleQueue}
        />
    </div>
    <div class="deck">
        <CardList
            cards={deck}
            onClick={handleRemoveFromDeck}
        />
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
        background-color: rgba(10,10,10,.95);
        color: white;
    }

    .bank {
        grid-area: bank;
        overflow-y: scroll;
    }

    .info {
        grid-area: info;
        display: flex;
    }

    .deck {
        grid-area: deck;
        overflow-y: scroll;
    }

    .header {
        grid-area: header;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
