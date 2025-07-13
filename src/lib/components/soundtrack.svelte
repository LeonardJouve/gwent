<script lang="ts">
    import {store} from "$lib/store/soundtrack.svelte";

    const muted = $derived(store.muted);
</script>

<audio
    class="audio"
    muted={muted}
    autoplay={true}
    loop={true}
    src="assets/audio/soundtrack.mp3"
></audio>

<style>
    .audio {
        display: none;
    }
</style>
