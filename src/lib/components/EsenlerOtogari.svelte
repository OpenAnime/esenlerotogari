<script lang="ts">
	import { onMount } from 'svelte';
	export let gap = 0;
	export let padding = 0;
	export let easingFunction: ((t: number) => number) | undefined = undefined;
	export let easingDuration = 500;
	export let root: HTMLElement | undefined = undefined;
	export let onPageData = (data: ReturnType<typeof getPageData>) => {};

	const waitForLayout = () =>
		new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(resolve);
			});
		});

	export const getVisibleItems = () => {
		if (!root) {
			return {
				visible: [],
				hidden: [],
				fullyVisible: [],
				partiallyVisible: []
			};
		}

		const visible: number[] = [];
		const hidden: number[] = [];
		const fullyVisible: number[] = [];
		const partiallyVisible: number[] = [];

		const viewStart = root.scrollLeft;
		const viewEnd = viewStart + root.clientWidth;
		const epsilon = 0.5;

		for (let i = 0; i < root.children.length; i++) {
			const child = root.children[i] as HTMLElement;

			const itemStart = child.offsetLeft;
			const itemEnd = itemStart + child.offsetWidth;

			const isVisible = itemEnd > viewStart + epsilon && itemStart < viewEnd - epsilon;
			const isFullyVisible = itemStart >= viewStart - epsilon && itemEnd <= viewEnd + epsilon;

			const itemNumber = i + 1;

			if (isVisible) {
				visible.push(itemNumber);

				if (isFullyVisible) {
					fullyVisible.push(itemNumber);
				} else {
					partiallyVisible.push(itemNumber);
				}
			} else {
				hidden.push(itemNumber);
			}
		}

		return {
			visible,
			hidden,
			fullyVisible,
			partiallyVisible
		};
	};

	export const getPageData = () => {
		if (!root) {
			return {
				totalPages: 0,
				currentPage: 0,
				currentPageFloat: 0,
				maxItemsPerPage: 0,
				pageProgress: 0,
				canGoLeft: false,
				canGoRight: false
			};
		}

		const totalItems = root.children.length;
		const visibleItems = getVisibleItems();
		const maxItemsPerPage = Math.max(visibleItems.fullyVisible.length, 1);
		const totalPages = Math.max(1, Math.ceil(totalItems / maxItemsPerPage));
		const maxScrollLeft = Math.max(0, root.scrollWidth - root.clientWidth);
		const currentScroll = root.scrollLeft;

		if (totalPages === 1 || maxScrollLeft <= 0) {
			return {
				totalPages,
				currentPage: 1,
				currentPageFloat: 1,
				maxItemsPerPage,
				pageProgress: 0,
				canGoLeft: false,
				canGoRight: false
			};
		}

		const pageOffsets: number[] = [];

		for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
			const itemNumber = Math.min(pageIndex * maxItemsPerPage + 1, totalItems);
			const child = root.children[itemNumber - 1] as HTMLElement;

			const rawOffset = child.offsetLeft - padding;
			const clampedOffset = Math.max(0, Math.min(rawOffset, maxScrollLeft));

			pageOffsets.push(clampedOffset);
		}

		let currentPageFloat = 1;

		if (currentScroll <= pageOffsets[0]) {
			currentPageFloat = 1;
		} else if (currentScroll >= pageOffsets[pageOffsets.length - 1]) {
			currentPageFloat = totalPages;
		} else {
			for (let i = 0; i < pageOffsets.length - 1; i++) {
				const start = pageOffsets[i];
				const end = pageOffsets[i + 1];

				if (currentScroll >= start && currentScroll <= end) {
					const range = end - start;

					if (range <= 0.5) {
						currentPageFloat = i + 2;
					} else {
						const localProgress = (currentScroll - start) / range;
						currentPageFloat = i + 1 + localProgress;
					}

					break;
				}
			}
		}

		const pageProgress = totalPages > 1 ? (currentPageFloat - 1) / (totalPages - 1) : 0;

		let currentPage = 1;
		let bestDistance = Infinity;

		for (let i = 0; i < pageOffsets.length; i++) {
			const distance = Math.abs(currentScroll - pageOffsets[i]);
			if (distance < bestDistance) {
				bestDistance = distance;
				currentPage = i + 1;
			}
		}

		const canGoLeft = currentScroll > 0.5;
		const canGoRight = currentScroll < maxScrollLeft - 0.5;

		return {
			totalPages,
			currentPage,
			currentPageFloat,
			maxItemsPerPage,
			pageProgress,
			canGoLeft,
			canGoRight
		};
	};

	export const goToNextPage = async () => {
		const visibles = getVisibleItems();
		const lastItemVisible = visibles.fullyVisible[visibles.fullyVisible.length - 1];
		const itemToStick = visibles.partiallyVisible
			.concat(visibles.hidden)
			.sort((a, b) => a - b)
			.find((i) => i > lastItemVisible);
		if (!itemToStick) return;

		await goTo(itemToStick, 'left');
	};

	export const goToPreviousPage = async () => {
		const visibles = getVisibleItems();
		const firstItemVisible = visibles.fullyVisible[0];
		const itemToStick = visibles.partiallyVisible
			.concat(visibles.hidden)
			.sort((a, b) => b - a)
			.find((i) => i < firstItemVisible);

		if (!itemToStick) return;

		await goTo(itemToStick, 'right');
	};

	export const goTo = async (number: number, forceAlign: 'left' | 'right' | false = false) => {
		if (!root || number < 1 || number > root.children.length) return;

		await waitForLayout();

		const targetChild = root.children[number - 1] as HTMLElement;
		const currentScroll = root.scrollLeft;

		const safeLeft = currentScroll + padding;
		const safeRight = currentScroll + root.clientWidth - padding;

		const childLeft = targetChild.offsetLeft;
		const childRight = childLeft + targetChild.offsetWidth;

		let targetScrollLeft = currentScroll;
		const alignLeftScroll = childLeft - padding;

		const isFullyVisible = childLeft >= safeLeft && childRight <= safeRight;
		const isWiderThanSafeZone = targetChild.offsetWidth > safeRight - safeLeft;
		const isFullyOffRight = childLeft >= currentScroll + root.clientWidth;
		const isFullyOffLeft = childRight <= currentScroll;

		if (forceAlign == 'left') {
			targetScrollLeft = alignLeftScroll;
		} else if (forceAlign == 'right') {
			targetScrollLeft = childRight - root.clientWidth + padding;
		} else if (isFullyVisible) {
			targetScrollLeft = currentScroll;
		} else if (isWiderThanSafeZone || isFullyOffRight || isFullyOffLeft) {
			targetScrollLeft = alignLeftScroll;
		} else if (childRight > safeRight) {
			targetScrollLeft = currentScroll + (childRight - safeRight);
		} else if (childLeft < safeLeft) {
			targetScrollLeft = currentScroll - (safeLeft - childLeft);
		}

		if (Math.abs(targetScrollLeft - currentScroll) < 1) return;
		await scrollTo(targetScrollLeft);

		onPageData(getPageData());
	};

	export const scrollTo = (targetPX: number): Promise<void> => {
		return new Promise((resolve) => {
			if (!root) return resolve();

			const maxScrollLeft = root.scrollWidth - root.clientWidth;
			const clampedTarget = Math.max(0, Math.min(targetPX, maxScrollLeft));

			if (!easingFunction) {
				root.scrollTo({ left: clampedTarget, behavior: 'smooth' });
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

				root!.scrollTo({ left: startScroll + distance * easingFunction(progress) });

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
		waitForLayout().then(() => {
			goTo(1);
			onPageData(getPageData());
		});
	});
</script>

<div id="esenler-holder" style="--gap-str: {gap}px">
	<div id="esenler-carousel" bind:this={root}><slot /></div>
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
