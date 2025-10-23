<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {navigate} from "svelte5-router";
    import {v4 as uuidv4} from 'uuid';
    import {stackCards, cardsArray} from "@shared/cards";
    import factions from "@shared/factions";
    import FactionHeader from "../components/faction_header.svelte";
    import GameCarousel from "../components/game_carousel.svelte";
    import DeckInfo from "../components/deck_info.svelte";
    import CardList from "../components/card_list.svelte";
    import {sortCards} from "../utils/utils";
    import {getFactionDeck, getLastFaction, setFactionDeck, setLastFaction} from "../utils/local_storage";
    import {serializeDeck} from "@shared/decks";
    import type {CardData, LeaderCardData} from "@shared/types/card";
    import type {FactionName} from "@shared/types/faction";
    import type {SerializedMatchmake} from "@shared/types/matchmake";
    import {closeCarousel} from "../store/carousel.svelte";
    import {clearNotifications} from "../store/notifications.svelte";

    const lastFactionName = getLastFaction() || "realms";
    let factionName = $state<FactionName>(lastFactionName);
    const faction = $derived(factions[factionName]);

    const lastDeck = getFactionDeck(lastFactionName);
    let leader = $state<LeaderCardData>(lastDeck.leader);
    let deck = $state<CardData[]>(lastDeck.cards);
    const bank = $derived.by(() => {
        const deckCardsWithAmount = stackCards(deck);

        return sortCards(cardsArray
            .filter(({faction, type}) => (faction === "neutral" || faction === factionName) && type !== "leader")
            .flatMap((card) => Array.from({length: card.maxPerDeck - (deckCardsWithAmount.get(card.filename)?.amount ?? 0)}, () => card)));
    });

    const handleChangeFaction = (name: FactionName) => {
        factionName = name;
        setLastFaction(factionName);
        const lastDeck = getFactionDeck(factionName);
        deck = lastDeck.cards;
        leader = lastDeck.leader;
    };

    const handleAddToDeck = (card: CardData): void => {
        deck.push(card);
        sortCards(deck);
        setFactionDeck(factionName, deck, leader);
    };

    const handleRemoveFromDeck = (card: CardData): void => {
        const index = deck.findIndex(({filename}) => card.filename === filename);
        if (index === -1) {
            return;
        }

        deck.splice(index, 1);
        setFactionDeck(factionName, deck, leader);
    };

    const handleSelectLeader = (newLeader: LeaderCardData) => {
        leader = newLeader;
        setFactionDeck(factionName, deck, leader);
    };

    let isInQueue = $state<boolean>(false);
    const id = $state<string>(uuidv4());
    let abortController = $state<AbortController>(new AbortController());

    onMount(() => {
        closeCarousel();
        clearNotifications();
    });

    onDestroy(() => {
        if (!isInQueue) return;
        abortController.abort();
    });

    const handleAbort = () => {
        if (!isInQueue) return;
        isInQueue = false;
        fetch(`/matchmaking/${id}`, {method: "DELETE"});
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

            const res = await fetch(`/matchmaking/${id}`, {
                method: "POST",
                body: JSON.stringify({
                    name: username,
                    faction: factionName,
                    deck: serializeDeck({
                        cards: deck,
                        leader,
                    }),
                } satisfies SerializedMatchmake),
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
            isInQueue={isInQueue}
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
