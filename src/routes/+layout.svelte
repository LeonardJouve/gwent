<script lang="ts">
	const {children} = $props();
</script>

<style>
    .main {
        cursor: url('assets/img/icons/cursor.png'), auto;
    }

    :global(p, h1, h2, body) {
        margin: 0;
    }
</style>

<section class="main">
    {@render children()}
</section>
