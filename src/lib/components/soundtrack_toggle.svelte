<script lang="ts">
    import {store} from "$lib/store/soundtrack.svelte";

    const handleToggle = () => store.muted = !store.muted;

    const opacity = $derived(store.muted ? 0.4 : 1);
</script>

<button
    class="toggle"
    onclick={handleToggle}
    style:opacity={opacity}
>♫</button>

<style>
    .toggle {
        background-color: transparent;
        border: none;
        width: 100%;
        height: 100%;
        color: goldenrod;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3vw;
    }
</style>
