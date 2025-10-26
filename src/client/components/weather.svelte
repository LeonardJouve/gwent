<script lang="ts">
    import CardContainer from "./card_container.svelte";
    import {store} from "../store/game.svelte";

    const selectedCard = $derived(store.selectedIndex === undefined ? undefined : store.players["me"].hand[store.selectedIndex]);

    const canPlay = $derived(selectedCard?.type === "weather" && store.turn === "me" && store.askPlay);

    const handleClick = () => {
        if (!canPlay || !store.askPlay || selectedCard?.type !== "weather") {
            return;
        };

        store.askPlay({
            type: "card",
            card: selectedCard.filename,
        });
    }
</script>

<div class="hoverable weather">
    <CardContainer
        cards={store.board.weather}
        onClick={handleClick}
        canOpenCarousel={!canPlay}
    />
</div>

<style>
    .weather {
        width: 100%;
        height: 100%;
    }
</style>
