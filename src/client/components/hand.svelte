<script lang="ts">
    import CardContainer from "../components/card_container.svelte";
    import {store as gameStore} from "../store/game.svelte";
    import {store as carouselStore} from "../store/carousel.svelte";
    import type {CardData} from "@shared/types/card";

    const hand = $derived(gameStore.players["me"].hand);
    const selectedIndex = $derived<number|undefined>(gameStore.selectedIndex);
    const selectedCard = $derived(selectedIndex === undefined ? undefined : gameStore.players["me"].hand[selectedIndex]);

    const handleSelect = (_: CardData, index: number) => gameStore.selectedIndex = index;

    const handleLeft = (event: Event) => {
        event.preventDefault();

        if (selectedIndex === undefined) {
            gameStore.selectedIndex = 0;
        } else {
            gameStore.selectedIndex = Math.max(0, selectedIndex - 1);
        }
    };

    const handleRight = (event: Event) => {
        event.preventDefault();

        if (selectedIndex === undefined) {
            gameStore.selectedIndex = 0;
        } else {
            gameStore.selectedIndex = Math.min(hand.length - 1, selectedIndex + 1);
        }
    };

    const handlePlay = (event: Event) => {
        event.preventDefault();

        if (gameStore.turn !== "me" || !gameStore.askPlay || !selectedCard) {
            return;
        }

        if (selectedCard.type !== "weather" && (selectedCard.type !== "unit" || selectedCard.rows.length !== 1)) {
            return;
        }

        gameStore.askPlay({
            type: "card",
            card: selectedCard.filename,
            row: selectedCard.type === "unit" ?
                selectedCard.rows[0] :
                undefined,
        });
    };

    const handleDeselect = (event: Event) => {
        event.preventDefault();
        gameStore.selectedIndex = undefined;
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (carouselStore.isOpen) {
            return;
        }

        switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
            handleLeft(event);
            break;
        case "KeyD":
        case "ArrowRight":
            handleRight(event);
            break;
        case "Space":
            handlePlay(event);
            break;
        case "Escape":
            handleDeselect(event);
            break;
        }
    };
</script>

<svelte:window onkeydown={handleKeydown}/>

<div class="hoverable hand">
    <CardContainer
        cards={hand}
        onSelect={handleSelect}
    />
</div>

<style>
    .hand {
        width: 100%;
        height: 100%;
    }
</style>
