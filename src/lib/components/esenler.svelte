<script>
  export let gap = 0;
  export let padding = 0;
  export let intersections = [];

  export let easingFunction;
  export let easingDuration = 500;

  let root;
  let currentNumber = 1;

  function getEntriesWithIntersectionLessThanOne(targets) {
    return new Promise((resolve) => {
      const observer = new IntersectionObserver((entries) => {
        const entriesWithIntersectionLessThanOne = entries
          .filter(
            (entry) =>
              entry.intersectionRect.width / entry.boundingClientRect.width < 1
          )
          .map((x) => {
            observer.unobserve(x.target);
            return {
              element: x.target,
              intersectionRatio: x.intersectionRatio * 100,
            };
          });

        intersections = entriesWithIntersectionLessThanOne;
        resolve(entriesWithIntersectionLessThanOne);
      });

      targets.forEach((target) => {
        observer.observe(target);
      });
    });
  }

  export async function goTo(number) {
    let operation = "scrollTo";
    const get = await getEntriesWithIntersectionLessThanOne(
      Array.from(root.children),
      root
    );

    const targetChildren = root.children[number - 1];

    if (get.map((x) => x.element).includes(targetChildren)) {
      const intersectionPercent = get.find(
        (x) => x.element == targetChildren
      ).intersectionRatio;
      //this means user can't see the children, let's scroll to it then.
      const getLeftOffset = targetChildren.offsetLeft;
      const getWidth = targetChildren.getBoundingClientRect().width;

      let calculateDistance;
      if (number >= currentNumber) {
        //we should do addition if target is on the right side
        calculateDistance = getLeftOffset - padding;
        if (intersectionPercent != 0) {
          //some of it can be seen. let's calculate the diff

          /*
      
        100 - 300
            x
         7  -  x
       ------------

       */

          const percentToPX = intersectionPercent * (getWidth / 100);
          const scrollBy = getWidth - percentToPX;
          operation = "scrollBy";
          calculateDistance = scrollBy + padding;
        }
      } else {
        calculateDistance = getLeftOffset - getWidth;
        if (calculateDistance > 0) {
          calculateDistance = getLeftOffset - padding;
        }
      }

      if (!easingFunction) {
        root[operation]({
          left: calculateDistance,
          behavior: "smooth",
        });
      } else {
        let willBeScrolledTo =
          operation == "scrollTo"
            ? calculateDistance
            : root.scrollLeft + calculateDistance;

        if (willBeScrolledTo < 0) willBeScrolledTo = 0;

        const maximumScrollLeft = root.scrollWidth - root.clientWidth;

        if (willBeScrolledTo > maximumScrollLeft) {
          willBeScrolledTo = maximumScrollLeft;
        }

        const start = root.scrollLeft;
        const target = willBeScrolledTo;
        const startTime = performance.now();

        function scrollStep(timestamp) {
          const currentTime = timestamp || performance.now();
          const elapsedTime = currentTime - startTime;

          root.scrollTo({
            left:
              start +
              (target - start) * easingFunction(elapsedTime / easingDuration),
          });

          if (elapsedTime < easingDuration) {
            requestAnimationFrame(scrollStep);
          }
        }

        requestAnimationFrame(scrollStep);
      }
    }

    currentNumber = number;
  }
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
