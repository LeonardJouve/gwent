<script lang="ts">
    import {largeClass} from "$lib/utils";
    import type { CardData } from "@shared/types/card";

    type Props = {
        cards: CardData[];
    };
    const {cards}: Props = $props();
</script>

<div class="card-list">
    {#each cards as card}
        <div
            class={[largeClass(card), "card"]}
            style={`--count: "${card.maxPerDeck}"`}
        ></div>
    {/each}
</div>

<style>
    .card-list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .card {
        width: 9.88vw;
        height: 18.45vw;
        position: relative;
        --count: "0";

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
</style>
