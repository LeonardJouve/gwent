<script lang="ts">
    import {onMount} from "svelte";
    import {smallClass} from "../utils/utils";
    import type {CardData} from "@shared/types/card";

    type Props = {
        card: CardData;
        isSelectible?: boolean;
        onSelect?: (card: CardData, event: MouseEvent) => void;
        score?: number;
        totalCardAmount?: number;
    };
    const {
        card,
        isSelectible,
        onSelect,
        totalCardAmount,
        score = card.type === "unit" ? card.strength : 0,
    }: Props = $props();

    let container: HTMLButtonElement;
    let width = $state<number>(0);

    onMount(() => {
        const observer = new ResizeObserver(() => {
            width = container.getBoundingClientRect().width;
        });
        observer.observe(container);

        return observer.disconnect;
    });

    const isUnit = $derived(card.type === "unit");
    const isHero = $derived(card.abilities.includes("hero"));
    const isBuffed = $derived(card.type === "unit" && score > card.strength);
    const isDebuffed = $derived(card.type === "unit" && score < card.strength);

    const handleSelect = $derived((event: MouseEvent) => onSelect?.(card, event));

    const overlap = $derived.by(() => {
        if (!totalCardAmount) {
            return "0px";
        }

        return `calc((100% - ${totalCardAmount * width}px) / ${2 * totalCardAmount})`;
    });

    // resizeCardContainer(overlap_count, gap, coef) {
	// 	let n = this.elem.children.length;
	// 	let param = (n < overlap_count) ?  "" + gap+"vw" : defineCardRowMargin(n, coef);
	// 	let children = this.elem.getElementsByClassName("card");
	// 	for (let x of children)
	// 		x.style.marginLeft = x.style.marginRight = param;

	// 	function defineCardRowMargin(n, coef = 0){
	// 		return "calc((100% - (4.45vw * " + n + ")) / (2*" +n+ ") - (" +coef+ "vw * " +n+ "))";
	// 	}
	// }
</script>

<button
    bind:this={container}
    style:margin-left={overlap}
    style:margin-right={overlap}
    class={{
        hoverable: isSelectible,
        card: true,
    }}
    onclick={handleSelect}
>
    <div class={[smallClass(card), "height"]}></div>
    {#if isUnit}
        <p class={{
            strength: true,
            hero: isHero,
            buffed: isBuffed,
            debuffed: isDebuffed,
        }}>
            {score}
        </p>
    {/if}
</button>

<style>
    .card {
        height: 95%;
        box-sizing: content-box;
        position: relative;

        &.hoverable:hover {
            margin-bottom: 10px;
        }
    }

    .texture {
        height: 100%;
    }

    .strength {
       position: absolute;
       top: 6%;
       left: 6%;
       width: 25%;
       text-align: center;
       font-size: 0.8vw;
       font-weight: bold;
       color: black;
       z-index: 10;
    }

    .hero {
        color: white;
    }

    .buffed {
        color: green;
    }

    .debuffed {
        color: firebrick;
    }
</style>
