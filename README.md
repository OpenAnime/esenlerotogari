# esenlerotogari

`esenlerotogari` is a Svelte carousel built for horizontally browsable content like cards, product rows, media rails, featured lists, and custom sliders.

It helps you give users a smoother way to explore wide sets of content without building carousel logic from scratch. You can reveal partially hidden items, move page by page, jump to a specific card, and keep control over how the scroll aligns and animates.

## Installation

```bash
pnpm add esenlerotogari
```

You can also install it with `npm` or `yarn` if that matches your project.

## Basic Usage

```svelte
<script lang="ts">
	import { expoOut } from 'svelte/easing';
	import { Carousel } from 'esenlerotogari';

	let carousel: Carousel;
	const items = Array.from({ length: 6 }, (_, i) => ({ title: `Card ${i + 1}` }));
</script>

<Carousel
	gap={16}
	padding={24}
	easingFunction={expoOut}
	easingDuration={500}
	onPageData={(data) => console.log(data)}
	bind:this={carousel}
>
	{#each items as item, i}
		<div style="width: 280px; height: 160px;" on:click={() => carousel.goTo(i + 1)}>
			{item.title}
		</div>
	{/each}
</Carousel>

<button on:click={() => carousel.goToPreviousPage()}>Previous</button>
<button on:click={() => carousel.goToNextPage()}>Next</button>
```

## Props

| Prop             | Type                                   | Default     | Description                                                                                          |
| ---------------- | -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `gap`            | `number`                               | `0`         | Gap between carousel items in pixels.                                                                |
| `padding`        | `number`                               | `0`         | Safe padding on the left and right edges when calculating visibility and alignment.                  |
| `easingFunction` | `((t: number) => number) \| undefined` | `undefined` | Optional easing function for custom animated scrolling. If omitted, native smooth scrolling is used. |
| `easingDuration` | `number`                               | `500`       | Duration in milliseconds for custom eased scrolling.                                                 |
| `onPageData`     | `(data) => void`                       | `() => {}`  | Called after initial mount and after programmatic `goTo(...)` navigation.                            |

## Instance API

Bind the component with `bind:this` to access its methods.

### `goTo(index, forceAlign?)`

Scrolls to a specific item using a 1-based index.

- `index`: item number starting from `1`
- `forceAlign`: `'left' | 'right' | false`, defaults to `false`

When `forceAlign` is omitted or set to `false`, the carousel only scrolls as much as needed to bring the item into view. When `forceAlign` is set to `'left'` or `'right'`, the scroll position is fully aligned to that side of the target item.

### `goToNextPage()`

Moves to the next calculated page.

### `goToPreviousPage()`

Moves to the previous calculated page.

### `scrollTo(px)`

Scrolls to a raw horizontal pixel offset.

### `getVisibleItems()`

Returns the current item visibility state:

```ts
{
	visible: number[];
	hidden: number[];
	fullyVisible: number[];
	partiallyVisible: number[];
}
```

All item numbers are 1-based.

### `getPageData()`

Returns the current pagination snapshot:

```ts
{
	totalPages: number;
	currentPage: number;
	currentPageFloat: number;
	maxItemsPerPage: number;
	pageProgress: number;
	canGoLeft: boolean;
	canGoRight: boolean;
}
```

## Behavior Notes

- The component renders children in a single horizontal flex row.
- Direct children are set to `flex-shrink: 0`, so items keep their width.
- For best results, give each child an explicit width or `min-width`.
- Page calculations are based on how many items are fully visible in the viewport.
- Item and page navigation use 1-based indexing, not 0-based indexing.
