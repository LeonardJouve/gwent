<script lang="ts">
    type Props = {
        getScore: () => void;
    };
    const {getScore}: Props = $props();
</script>

<div class="score">
    <p>{getScore()}</p>
</div>

<style>
    .score {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
