<script>
// @ts-nocheck

    import { Carousel } from '$lib'
    let carousel;
</script>

<Carousel gap="16" bind:this={carousel} leftPadding="4rem" rightPadding="4rem">
    {#each Array(10) as _, i}
        <div id="testDiv">
            <h1>Test {i + 1}</h1>
        </div>
    {/each}
</Carousel>

<button on:click={() => carousel.goTo(7)}>Ğ</button>


<style>
    #testDiv {
        width: 220px;
        height: 100px;
        background-color: red;
    }
</style>
