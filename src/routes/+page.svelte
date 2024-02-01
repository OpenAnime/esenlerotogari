<script>
  import { Carousel } from "$lib";

  let es;
  let intersections = [];

  $: console.log(intersections);

  function expoOut(t) {
    return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
  }
</script>

<Carousel
  gap={10}
  padding={25}
  bind:this={es}
  bind:intersections
  easingFunction={expoOut}
  easingDuration={500}
>
  {#each new Array(30) as child, i}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      id="child{i + 1}"
      on:click={es.goTo(i + 1)}
      style="width: 300px; height: 100px; background-color:red;"
    >
      {i + 1}
    </div>
  {/each}
</Carousel>

<button on:click={() => es.goTo(14)}>14</button>

<style>
  :global(body) {
    margin: 0;
  }
</style>
