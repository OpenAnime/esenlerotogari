<script>
// @ts-nocheck

    import { Carousel } from '$lib'
    let carousel;
</script>

<Carousel gap="16" bind:this={carousel} rightPadding={64}>
    {#each Array(10) as _, i}
    {#if i == 0}
    <div id="testDiv" on:click={() => carousel.goTo(i+1)} style="margin-left:2rem">
        <h1>Test {i + 1}</h1>
    </div>
    {:else}
    <div id="testDiv" on:click={() => carousel.goTo(i+1)}>
        <h1>Test {i + 1}</h1>
    </div>
    {/if}
    {/each}
</Carousel>



<style>
    #testDiv {
        width: 220px;
        height: 100px;
        background-color: red;
    }

    :global(body) {
        margin: 0;
    }
</style>
