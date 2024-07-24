<script lang="ts">
	import { onMount } from 'svelte';

	export let gap = 0;
	export let padding = 0;

	export let easingFunction: ((t: number) => number) | undefined = undefined;
	export let easingDuration = 500;
	export let root: HTMLElement | undefined = undefined;

	let currentNumber = 1;

	function getEntriesWithIntersectionLessThanOne(
		targets: Element[],
		filter = true
	): Promise<
		{
			element: Element;
			intersectionRatio: number;
		}[]
	> {
		return new Promise((resolve) => {
			let gotOne = false;

			const observer = new IntersectionObserver((entries) => {
				if (gotOne) return;
				gotOne = true;

				const entriesWithIntersectionLessThanOne = entries
					.filter((entry) =>
						filter ? entry.intersectionRect.width / entry.boundingClientRect.width < 1 : true
					)
					.map((x) => {
						observer.unobserve(x.target);
						return {
							element: x.target,
							intersectionRatio: x.intersectionRatio * 100
						};
					});

				resolve(entriesWithIntersectionLessThanOne);
			});

			targets.forEach((target) => observer.observe(target));
		});
	}

	export const getIntersections = (filter = false) => {
		return getEntriesWithIntersectionLessThanOne(Array.from(root!.children), filter);
	};

	export const goTo = async (number: number) => {
		let operation: 'scrollTo' | 'scrollBy' = 'scrollTo';

		const entries = await getIntersections(true);
		const targetChildren = root!.children[number - 1] as HTMLElement;

		if (entries.map((x) => x.element).includes(targetChildren)) {
			const intersectionPercent = entries.find(
				(x) => x.element == targetChildren
			)!.intersectionRatio;

			const getLeftOffset = targetChildren.offsetLeft;
			const getWidth = targetChildren.getBoundingClientRect().width;

			let calculateDistance;

			if (number >= currentNumber) {
				calculateDistance = getLeftOffset - padding;

				if (intersectionPercent != 0) {
					const percentToPX = intersectionPercent * (getWidth / 100);
					const scrollBy = getWidth - percentToPX;

					operation = 'scrollBy';
					calculateDistance = scrollBy + padding;
				}
			} else {
				calculateDistance = getLeftOffset - getWidth;
				if (calculateDistance > 0) calculateDistance = getLeftOffset - padding;
			}

			if (!easingFunction) {
				root![operation]({
					left: calculateDistance,
					behavior: 'smooth'
				});
			} else {
				const willBeScrolledTo =
					operation == 'scrollTo' ? calculateDistance : root!.scrollLeft + calculateDistance;

				scrollTo(willBeScrolledTo);
			}
		}

		currentNumber = number;
	};

	export const scrollTo = async (targetPX: number) => {
		if (!easingFunction) {
			return root!.scrollTo({
				left: targetPX,
				behavior: 'smooth'
			});
		}

		const maximumScrollLeft = root!.scrollWidth - root!.clientWidth;

		if (targetPX < 0) targetPX = 0;
		if (targetPX > maximumScrollLeft) targetPX = maximumScrollLeft;

		const start = root!.scrollLeft;
		const startTime = performance.now();

		const scrollStep = (timestamp: number) => {
			const currentTime = timestamp || performance.now();
			const elapsedTime = currentTime - startTime;

			root!.scrollTo({
				left: start + (targetPX - start) * easingFunction(elapsedTime / easingDuration)
			});

			if (elapsedTime < easingDuration) requestAnimationFrame(scrollStep);
		};

		requestAnimationFrame(scrollStep);
	};

	onMount(() => goTo(1));
</script>

<div id="esenler-holder" style="--gap-str: {gap}px">
	<div id="esenler-carousel" bind:this={root}>
		<slot />
	</div>
</div>

<style>
	#esenler-carousel {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
		gap: var(--gap-str);
	}

	#esenler-carousel::-webkit-scrollbar {
		display: none;
	}

	:global(#esenler-carousel > *) {
		flex-shrink: 0;
	}
</style>
