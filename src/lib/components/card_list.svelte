<script lang="ts">
    import {iconURL, largeClass} from "$lib/utils";
    import type {CardData} from "@shared/types/card";

    type Props = {
        cards: CardData[];
        onClick: (card: CardData) => void;
    };
    const {cards, onClick}: Props = $props();

    type CardWithAmount = CardData & {amount: number};
    const cardsWithAmount = $derived(cards.reduce<Map<CardData["filename"], CardWithAmount>>((acc, card) => {
        const previousCard = acc.get(card.filename);
        if (previousCard) {
            previousCard.amount += 1;
        } else {
            acc.set(card.filename, {...card, amount: 1});
        }

        return acc;
    }, new Map()).values());
</script>

<div class="card-list">
    {#each cardsWithAmount as card}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class={[largeClass(card), "card"]}
            onclick={() => onClick(card)}
        >
            <div class="amount">
                <img
                    src={iconURL("preview_count")}
                    alt="amount"
                />
                <p>{card.amount}</p>
            </div>
        </div>
    {/each}
</div>

<style>
    .card-list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
    }

    .card {
        width: 9.88vw;
        height: 18.45vw;
        position: relative;
        --count: "0";

    }

    .amount {
        display: flex;
        gap: 2px;
        position: absolute;
        top: 82.5%;
        left: 55%;
        width: 20%;
        height: 7%;
        font-size: 1.2vw;
        color: #5f4923;
        padding-left: 1.7vw;
    }
</style>
