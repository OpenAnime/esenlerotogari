<script>
  import { onMount } from "svelte";
  export let gap = 0;
  export let padding = 0;

  let root;
  let currentNumber = 1;

  function getEntriesWithIntersectionLessThanOne(targets, root) {
    return new Promise((resolve, reject) => {
      const observer = new IntersectionObserver((entries) => {
        const entriesWithIntersectionLessThanOne = entries
          .filter((entry) => entry.intersectionRatio < 1)
          .map((x) => {
            observer.unobserve(x.target);
            return x.target;
          });
        resolve(entriesWithIntersectionLessThanOne);
      });

      targets.forEach((target) => {
        observer.observe(target);
      });
    });
  }

  export async function goTo(number) {
    const get = await getEntriesWithIntersectionLessThanOne(
      Array.from(root.children),
      root
    );

    const targetChildren = root.children[number - 1];

    if (get.includes(targetChildren)) {
      //this means user can't see the children, let's scroll to it then.
      const getLeftOffset = targetChildren.offsetLeft;
      const getWidth = targetChildren.getBoundingClientRect().width;

      let calculateDistance;
      if (number >= currentNumber) {
        //we should do addition if target is on the right side
        calculateDistance = getLeftOffset - padding;
      } else {
        calculateDistance = getLeftOffset - getWidth;
        if (calculateDistance > 0) {
          calculateDistance = getLeftOffset - padding;
        }
      }

      root.scrollTo({
        left: calculateDistance,
        behavior: "smooth",
      });
    }

    currentNumber = number;
  }
</script>

<div id="esenlerotogariHolder" style="--gap-str: {gap}px">
  <div id="esenlerotogariCarousel" bind:this={root}>
    <slot />
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
