<script lang="ts">
    import Soundtrack from '$lib/components/soundtrack.svelte';

	const {children} = $props();
</script>

<style>
    .main {
        cursor: url('assets/img/icons/cursor.png'), auto;
    }

    :global(p, h1, h2, body) {
        margin: 0;
    }

    :global(button, dialog) {
        padding: 0;
        background-color: transparent;
        border: none;
        outline: none;
        cursor: unset;
    }
</style>

<section class="main">
    <Soundtrack/>
    {@render children()}
</section>
