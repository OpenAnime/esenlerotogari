<script>
// @ts-nocheck

    import { Carousel } from '$lib'
    let carousel;
</script>

<Carousel gap="16" bind:this={carousel}>
    {#each Array(30) as _, i}
        <div id="testDiv">
            <h1>Test {i + 1}</h1>
        </div>
    {/each}
</Carousel>

<button on:click={() => carousel.prev()}>Prev</button>
<button on:click={() => carousel.next()}>Next</button>

<style>
    #testDiv {
        width: 100px;
        height: 100px;
        background-color: red;
    }
</style>
