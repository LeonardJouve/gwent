<script lang="ts">
    import {getPlayerScore} from "$lib/store/game.svelte";
    import type {PlayerIndicator} from "@shared/types/player";
    import Score from "$lib/components/score.svelte";
    import {iconURL} from "$lib/utils";
    import factions from "$lib/factions";
    import {store} from "$lib/store/game.svelte";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const getScore = $derived(() => getPlayerScore(player));
    const otherScore = $derived(getPlayerScore(player === "me" ? "opponent" : "me"));
    const playerData = $derived(store.players[player]);
    const faction = $derived(factions[playerData.faction]);
    const handSize = $derived(playerData.hand ? playerData.hand.length : playerData.handSize);
    const isCurrentTurn = $derived(store.turn === player);
    const isMe = $derived(player === "me");
</script>

<div class={{
    infos: true,
    "current-turn": isCurrentTurn,
}}>
    <div class="score">
        {#if getScore() > otherScore}
            <img
                class="high-score"
                alt="high-score"
                src={iconURL("icon_high_score")}
            />
        {/if}
        <img
            class="score-background"
            alt="score"
            src={iconURL("score_total_" + player)}
        />
        <Score getScore={getScore}/>
    </div>
    <div class="profile">
        <img
            class="profile-picture"
            alt="profile"
            src={iconURL("profile")}
        />
        <img
            class="profile-border"
            alt="border"
            src={iconURL("icon_player_border")}
        />
        <img
            class={{
                "profile-shield": true,
                isMe,
            }}
            alt="shield"
            src={iconURL("deck_shield_" + faction.id)}
        />
    </div>
    <div class={{
        details: true,
        isMe,
    }}>
        <div>
            <h2>{playerData.name}</h2>
            <p>{faction.name}</p>
        </div>
        <div class="stats">
            <div class="hand">
                <img
                    alt="card"
                    src={iconURL("icon_card_count")}
                />
                <p>{handSize}</p>
            </div>
            <div class="gems">
                {#each {length: 2}, i}
                    {#if playerData.gems >= i + 1}
                        <img
                            class="gem"
                            alt="gem"
                            src={iconURL("icon_gem_on")}
                        />
                    {:else}
                        <img
                            class="gem"
                            alt="empty gem"
                            src={iconURL("icon_gem_off")}
                        />
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .infos {
        width: 100%;
        height: 100%;
        padding: 3% 0 3% 15%;
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        gap: 3%;
        background-color: rgba(20,20,20,0.6);
    }

    .current-turn {
        box-shadow: 0 0px 1vw 0.1vw goldenrod;
    }

    .score {
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translate(50%, -50%);
        width: 12.5%;
        height: 35%;
    }

    .score-background {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
    }

    .high-score {
        position: absolute;
        height: 130%;
        top: 0px;
        left: 0px;
        transform: translateX(-20%);
    }

    .profile {
        position: relative;
        height: 100%;
    }

    .profile-picture {
        position: absolute;
        height: 80%;
        top: 0px;
        left: 0px;
        transform: translate(10%, 11%);
    }

    .profile-border {
        position: relative;
        height: 100%;
    }

    .profile-shield {
        position: absolute;
        height: 50%;
        top: 0px;
        left: 0px;
        transform: translate(-30%, -10%);

        &.isMe {
            top: unset;
            bottom: 0px;
            left: 0px;
            transform: translate(-30%, 10%);
        }
    }

    .details {
        display: flex;
        flex-direction: column;
        color: goldenrod;
    }

    .isMe {
        flex-direction: column-reverse;
    }

    .stats {
        display: flex;
        align-items: center;
        gap: 3px;
    }

    .gems {
        display: flex;
        flex: 1;
        justify-content: end;
        gap: 3%;
    }

    .gem {
        width: 40%;
    }

    .hand {
        display: flex;
        align-items: center;
        gap: 3%;
    }
</style>
