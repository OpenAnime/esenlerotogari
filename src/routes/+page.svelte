<script>
  import { Carousel } from "$lib";

  let es;
</script>

<Carousel gap={16} padding={20} bind:this={es}>
  {#each new Array(30) as child, i}
    <div
      id="child{i + 1}"
      style="width: 300px; height: 100px; background-color:red;"
    >
      {i + 1}
    </div>
  {/each}
</Carousel>

<button on:click={() => es.goTo(10)}>10</button>
<button on:click={() => es.goTo(1)}>1</button>
<button on:click={() => es.goTo(2)}>2</button>

<style>
  :global(body) {
    margin: 0;
  }
</style>
