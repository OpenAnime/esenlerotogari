<script>
  // @ts-nocheck
  export let gap;
  export let padding = 0
  let root;

  export function goTo(number) {
    const parent = root
    let visiblePX = (parent.getBoundingClientRect().width - window.innerWidth) - parent.getBoundingClientRect().left
    if (visiblePX > 0) {
      visiblePX = window.innerWidth
    } else {
      for (let element of parent.children) {
        if ((element.offsetLeft - visiblePX) === 0) {
          visiblePX += element.getBoundingClientRect().width
        } else {
          visiblePX += (element.offsetLeft - visiblePX)
        }
      }
      if (visiblePX > window.innerWidth) visiblePX = window.innerWidth
    }

    let visibleElements = []
    let fullVisibleElements = []
    for (let element of parent.children) {
      const min = parent.scrollLeft
      const max = visiblePX + min
      if ((element.offsetLeft < min && element.offsetLeft + element.getBoundingClientRect().width >= min) || (element
          .offsetLeft >= min && element.offsetLeft + element.getBoundingClientRect().width <= max) || (element
          .offsetLeft > min && element.offsetLeft <= max)) {
        visibleElements.push(element)
      }
      if (element.offsetLeft >= min && element.offsetLeft + element.getBoundingClientRect().width <= max)
        fullVisibleElements.push(element)
    }
    const getEl = parent.children[number - 1]
    if (fullVisibleElements.includes(getEl)) return
    if (visibleElements.includes(getEl)) {
      if (getEl.offsetLeft < parent.scrollLeft) {
        parent.scrollBy({
        left: -Math.abs((parent.scrollLeft - getEl.offsetLeft) + padding),
        behavior: 'smooth'
      })
      } else {
        parent.scrollBy({
          left: (getEl.offsetLeft - (parent.scrollLeft + visiblePX)) + getEl.getBoundingClientRect().width +
            padding,
          behavior: 'smooth'
        })
      }
    } else {
        parent.scrollBy({
          left: (getEl.offsetLeft - (parent.scrollLeft + visiblePX)) + getEl.getBoundingClientRect().width +
            padding,
          behavior: 'smooth'
        })
      }
  }
</script>

<div id="esenlerotogariHolder" style="--gap-str: {gap}px">
  <div id="esenlerotogariCarousel" bind:this={root}>
    <slot></slot>
  </div>
</div>


<style>
  #esenlerotogariCarousel {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    gap: var(--gap-str);
  }

  #esenlerotogariCarousel::-webkit-scrollbar {
    display: none;
  }

  :global(#esenlerotogariCarousel > *) {
    flex-shrink: 0;
  }
</style>