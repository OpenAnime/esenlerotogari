<script lang="ts">
	import { onMount } from 'svelte';

	export let gap = 0;
	export let padding = 0;

	export let easingFunction: ((t: number) => number) | undefined = undefined;
	export let easingDuration = 500;
	export let root: HTMLElement | undefined = undefined;

	const waitForLayout = () =>
		new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(resolve);
			});
		});

	export const goTo = async (number: number) => {
		if (!root || number < 1 || number > root.children.length) return;

		await waitForLayout();

		const targetChild = root.children[number - 1] as HTMLElement;
		const rootRect = root.getBoundingClientRect();
		const childRect = targetChild.getBoundingClientRect();
		const currentScroll = root.scrollLeft;

		const safeLeft = rootRect.left + padding;
		const safeRight = rootRect.right - padding;

		let targetScrollLeft = currentScroll;
		const alignLeftScroll = currentScroll + (childRect.left - rootRect.left) - padding;

		const isFullyVisible = childRect.left >= safeLeft && childRect.right <= safeRight;
		const isWiderThanSafeZone = childRect.width > safeRight - safeLeft;
		const isFullyOffRight = childRect.left >= rootRect.right;
		const isFullyOffLeft = childRect.right <= rootRect.left;

		if (isFullyVisible) {
			targetScrollLeft = currentScroll;
		} else if (isWiderThanSafeZone || isFullyOffRight || isFullyOffLeft) {
			targetScrollLeft = alignLeftScroll;
		} else if (childRect.right > safeRight) {
			targetScrollLeft = currentScroll + (childRect.right - safeRight);
		} else if (childRect.left < safeLeft) {
			targetScrollLeft = currentScroll - (safeLeft - childRect.left);
		}

		if (Math.abs(targetScrollLeft - currentScroll) < 1) return;

		await scrollTo(targetScrollLeft);
	};

	export const scrollTo = (targetPX: number): Promise<void> => {
		return new Promise((resolve) => {
			if (!root) return resolve();

			const maxScrollLeft = root.scrollWidth - root.clientWidth;
			const clampedTarget = Math.max(0, Math.min(targetPX, maxScrollLeft));

			if (!easingFunction) {
				root.scrollTo({
					left: clampedTarget,
					behavior: 'smooth'
				});
				if ('onscrollend' in window) {
					root.addEventListener('scrollend', () => resolve(), { once: true });
				} else {
					setTimeout(resolve, 500);
				}
				return;
			}

			const startScroll = root.scrollLeft;
			const distance = clampedTarget - startScroll;

			if (Math.abs(distance) < 1) return resolve();

			const startTime = performance.now();

			const scrollStep = (timestamp: number) => {
				const currentTime = timestamp || performance.now();
				const elapsedTime = currentTime - startTime;
				const progress = Math.min(elapsedTime / easingDuration, 1);

				root!.scrollTo({
					left: startScroll + distance * easingFunction(progress)
				});

				if (progress < 1) {
					requestAnimationFrame(scrollStep);
				} else {
					resolve();
				}
			};

			requestAnimationFrame(scrollStep);
		});
	};

	onMount(() => {
		waitForLayout().then(() => goTo(1));
	});
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
