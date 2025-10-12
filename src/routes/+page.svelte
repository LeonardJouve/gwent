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

    let deck = $state<CardData[]>([]);
    const bank = $derived(cards
        .filter(({faction, type}) => (faction === "neutral" || faction === factionName) && type !== "leader")
        .sort((a, b) => {
            const typeRank = (card: CardData) => {
                switch (true) {
                case card.type === "special" || card.abilities.includes("decoy"):
                    return 0;
                case card.type === "weather":
                    return 1;
                case card.abilities.includes("hero"):
                    return 2;
                default:
                    return 3;
                }
            };

            const typeDiff = typeRank(a) - typeRank(b);
            if (typeDiff) {
                return typeDiff;
            }

            const strengthDiff = (b.type === "unit" ? b.strength : 0) - (a.type === "unit" ? a.strength : 0);
            if (strengthDiff) {
                return strengthDiff;
            }

            return a.name.localeCompare(b.name);
        }));
    let leader = $state<LeaderCardData>(cards[24] as LeaderCardData);

    const handleChangeFaction = (name: FactionName) => {
        factionName = name;
        deck = [];
    };

    const handleAddToDeck = (card: CardData): void => {
        deck.push(card);
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
