<script lang="ts">
    import CardContainer from "./card_container.svelte";
    import {store} from "../store/game.svelte";

    const canPlay = $derived(store.selectedCard?.type === "weather" && store.turn === "me" && store.askPlay);

    const handleClick = () => {
        if (!canPlay || !store.askPlay || store.selectedCard?.type !== "weather") {
            return;
        };

        store.askPlay({
            type: "card",
            card: store.selectedCard.filename,
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
