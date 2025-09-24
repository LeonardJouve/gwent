<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import type {PlayerIndicator} from "@shared/types/player";
    import {store} from "$lib/store/game.svelte";

    let modal: HTMLDialogElement;

    $effect(() => {
        if (store.askStart) {
            modal.showModal();
        } else {
            modal.close();
        }
    });

    const handleChoice = (player: PlayerIndicator) => {
        store.askStart?.(player);
    };
</script>

<dialog
    class={{
        modal: true,
        hidden: !store.askStart,
    }}
    bind:this={modal}
>
    <h2 class="title">
        Would you like to go first?
    </h2>
    <p class="content">
        The Scoia'tael faction perk allows you to decide who will get to go first.
    </p>
    <div class="actions">
        <Button
            onclick={() => handleChoice("me")}
            content="Go First"
        />
        <Button
            onclick={() => handleChoice("opponent")}
            content="Let Opponent Start"
        />
    </div>
</dialog>

<style>
    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 10px;
        background-color: #13100f;
        color: #B6B0A7;

        border-width: 15px;
        border-style: solid;
        border-image-source: url("assets/img/dialog_border.svg");
        border-image-slice: 49% 49%;

        &::backdrop {
            background-color: black;
            opacity: 0.8;
        }
    }

    .hidden {
        display: none;
    }

    .title {
        text-transform: capitalize;
        color: #75716D;
    }

    .actions {
        display: flex;
        gap: 20px;
    }
</style>
