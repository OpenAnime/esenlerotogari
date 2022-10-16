<script>
  // @ts-nocheck
  export let gap;
  export let leftPadding;
  export let rightPadding;
  let root;

  export function goTo(number) {
      const getEl = root.children[number - 1]
      getEl.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }
</script>

<div id="esenlerotogariCarousel" style="gap: {gap}px; scroll-padding-right: {rightPadding}; scroll-padding-left: {leftPadding}" bind:this={root}>
  <slot></slot>
</div>

<style>
  #esenlerotogariCarousel {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow: hidden;
  }

  :global(#esenlerotogariCarousel > *) {
    flex-shrink: 0;
  }
</style>