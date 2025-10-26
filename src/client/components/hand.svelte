<script lang="ts">
    import CardContainer from "../components/card_container.svelte";
    import {store as gameStore} from "../store/game.svelte";
    import {store as carouselStore} from "../store/carousel.svelte";
    import type {CardData} from "@shared/types/card";

    const handleSelect = $derived((_: CardData, index: number) => selectedIndex = index);
    const hand = $derived(gameStore.players["me"].hand);
    let selectedIndex = $state<number|null>(null);

    $effect(() => {
        if (selectedIndex === null) {
            gameStore.selectedCard = undefined;
        } else {
            gameStore.selectedCard = hand[selectedIndex];
        }
    });

    const handleLeft = (event: Event) => {
        event.preventDefault();

        if (selectedIndex === null) {
            selectedIndex = 0;
        } else {
            selectedIndex = Math.max(0, selectedIndex - 1);
        }
    };

    const handleRight = (event: Event) => {
        event.preventDefault();

        if (selectedIndex === null) {
            selectedIndex = 0;
        } else {
            selectedIndex = Math.min(hand.length - 1, selectedIndex + 1);
        }
    };

    const handlePlay = (event: Event) => {
        event.preventDefault();

        if (gameStore.turn !== "me" || !gameStore.askPlay || !gameStore.selectedCard) {
            return;
        }

        if (gameStore.selectedCard.type !== "weather" && (gameStore.selectedCard.type !== "unit" || gameStore.selectedCard.rows.length !== 1)) {
            return;
        }

        selectedIndex = null;
        gameStore.askPlay({
            type: "card",
            card: gameStore.selectedCard.filename,
            row: gameStore.selectedCard.type === "unit" ?
                gameStore.selectedCard.rows[0] :
                undefined,
        });
    };

    const handleDeselect = (event: Event) => {
        event.preventDefault();
        selectedIndex = null;
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
