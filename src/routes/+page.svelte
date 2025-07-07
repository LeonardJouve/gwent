<script>
    import {iconURL, largeURL} from "$lib/utils";
    import cards from "$lib/cards";
    import factions from "$lib/factions";

    const faction = factions["realms"];

    const bank = cards.slice(10, 20);
    const deck = cards.slice(0, 10);
    const leader = cards[24];
</script>

<style>
    .deck-maker {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 35px 60px 35px 60px;
        /* background-color: rgba(10,10,10,.95); */
    }

    .header {
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
        overflow-y: scroll;
        flex-wrap: wrap;
        gap: 10px;
    }

    .card {
        width: 9.88vw;
        height: 18.45vw;
        position: relative;
        --count: "1";

        img {
            border-radius: 1vw;
            width: 100%;
            height: 100%;
        }

        &::before {
            content: var(--count);
            background-image: url('assets/img/icons/preview_count.png');
            position: absolute;
            top: 82.5%;
            left: 76%;
            width: 20%;
            height: 7%;
            font-size: 1.2vw;
            color: #5f4923;
            padding-left: 1.7vw;
            background-image: url('assets/img/icons/preview_count.png');
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    .main {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 10px;
        overflow: hidden;
    }

    .deck-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
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
        height: 20%;
        border-radius: .5vw;
    }

    .toggle-music {
        font-size: 2.5vw;
    }
</style>

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

    <div class="main">
        <div class="card-list">
            {#each bank as card}
                <div
                    class="card"
                    style={`--count: "${card.count}"`}
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
            <input id="username" placeholder="Username"/>
            <button id="start-game">Start game</button>
        </div>
        <div class="card-list">
            {#each deck as card}
                <div
                    class="card"
                    style={`--count: "${card.count}"`}
                >
                    <img
                        alt={card.name}
                        src={largeURL(card)}
                    />
                </div>
            {/each}
        </div>
    </div>
</section>
