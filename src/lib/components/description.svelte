<script lang="ts" generics="T">
    import type {Snippet} from "svelte";

    type Props = {
        element: T;
        renderHeader: Snippet<[T]>;
        renderDescription: Snippet<[T]>;
    };
    const {element, renderHeader, renderDescription}: Props = $props();
</script>

<div class="container">
    <div class="header">
        {@render renderHeader(element)}
    </div>
    <div class="description">
        {@render renderDescription(element)}
    </div>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        padding: 0.3vh 0.5vw 0.3vh 0.5vw;
        box-sizing: border-box;

        background-color: rgba(20,20,20, 0.95);
        color: tan;
        text-align: center;
        pointer-events : none;
        border: .1vw solid #ffffff57;
        border-width: .1vw 0;

        display: flex;
        flex-direction: column;
        gap: 0.3vh;
    }

    .header {
        height: 2.5vw;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5vw;
        font-weight: bold;
        text-transform: capitalize;
    }
</style>
