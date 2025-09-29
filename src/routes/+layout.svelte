<script lang="ts">
    import.meta.glob(["$lib/css/**/*.css"], {eager: true});

    const {children} = $props();
</script>

<style>
    .main {
        cursor: url("assets/img/icons/cursor.png"), auto;
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

    @font-face {
        font-family: "GWENT";
        src: url("/assets/fonts/gwent.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
    }

    :global(html, body) {
        font-family: "GWENT", Regular;
    }

    :global(*) {
        font-family: inherit;
    }
</style>

<section class="main">
    {@render children()}
</section>
