<script lang="ts">
    import {iconURL} from "$lib/utils";
</script>

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

<style>
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
</style>
