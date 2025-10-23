<script lang="ts">
    import {Router, Route} from "svelte5-router";
    import DeckBuilder from "./routes/deck_builder.svelte";
    import Game from "./routes/game.svelte";

    import.meta.glob(["./css/**/*.css"], {eager: true});
</script>

<Router url="">
    <div>
        <Route path="/" component={DeckBuilder}/>
        <Route path="/game" component={Game}/>
    </div>
</Router>

<style>
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
        cursor: url("/assets/img/icons/cursor.png"), auto;
    }

    :global(*) {
        font-family: inherit;
        cursor: inherit;
    }
</style>
