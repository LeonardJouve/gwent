<script lang="ts">
    import {store} from "../store/game.svelte";
    import type {PlayerIndicator} from "@shared/types/player";
    import Card from "../components/card.svelte";
    import CardPile from "../components/card_pile.svelte";
    import {openCarousel} from "../store/carousel.svelte";

    type Props = {
        player: PlayerIndicator;
    };
    const {player}: Props = $props();

    const grave = $derived(store.players[player].grave);

    const handleOpenCarousel = (): void => openCarousel({
        cards: grave,
        isClosable: true,
        amount: 1,
        onClose: () => {},
    });
</script>

{#snippet card(i: number)}
    <Card card={grave[i]}/>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="grave hoverable"
    onclick={handleOpenCarousel}
>
    <CardPile
        cardAmount={grave.length}
        render={card}
    />
</div>

<style>
    .grave {
        width: 100%;
        height: 100%;
    }
</style>
