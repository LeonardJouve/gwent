<script lang="ts">
    import {imgURL} from "$lib/utils";

    let muted = $state<boolean>(true);

    const handleToggle = (): void => {
        muted = !muted;
    };

    const opacity = $derived(muted ? 0.4 : 1);
</script>

<audio
    class="audio"
    muted={muted}
    autoplay={true}
    loop={true}
    src="assets/audio/soundtrack.mp3"
></audio>

<button
    class="toggle"
    onclick={handleToggle}
    style:opacity={opacity}
>
    <img
        class="image"
        src={imgURL(`music${muted ? "_mute" : ""}`, "png")}
        alt="music"
    />
</button>

<style>
    .audio {
        display: none;
    }

    .toggle {
        color: goldenrod;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image {
        width: 3vw;
        height: auto;
    }
</style>
