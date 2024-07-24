<script lang="ts">
	import { onMount } from 'svelte';
	import { expoOut } from 'svelte/easing';

	import EsenlerOtogari from '$lib/components/EsenlerOtogari.svelte';

	let carouselEl: EsenlerOtogari;

	onMount(async () => {
		carouselEl.scrollTo(200);
	});
</script>

<EsenlerOtogari
	gap={10}
	padding={25}
	easingFunction={expoOut}
	easingDuration={500}
	bind:this={carouselEl}
>
	<!-- eslint-disable @typescript-eslint/no-unused-vars -->
	{#each new Array(30) as _, i}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => carouselEl.goTo(i + 1)}
			style="width: 300px; height: 100px; background-color:red;"
		>
			{i + 1}
		</div>
	{/each}
</EsenlerOtogari>

<button on:click={() => carouselEl.goTo(14)}>14</button>

<style>
	:global(body) {
		margin: 0;
	}
</style>
