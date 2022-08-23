<script>
// @ts-nocheck
  export let gap;
  let root;
  let current = 0;
  let difference = 0;

  function nearCollision(current, side) {
   const container = root.querySelector("#esenlerotogariCarousel")
   let getLast = container.lastElementChild
   let elementzort = container.children[current]
   if(side === "left") {
    getLast = container.children[0]
    elementzort = container.children[0]
   } 
   const offset = elementzort.offsetLeft
   const maxScrollLeft = container.scrollWidth - container.clientWidth;
   const calc = getLast.getBoundingClientRect().width + Number(gap)
   const sub = maxScrollLeft - (offset-gap)
   if(sub <= calc) {
    difference = sub
     return true
   } else {
     return false
   }
  }

  export function next() {
   const container = root.querySelector("#esenlerotogariCarousel")
   const length = container.children.length
   if(current >= length) return
    current++
    const elementzort = container.children[current]
    const offset = elementzort.offsetLeft
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
  if(nearCollision(current, "right") === true) {
    container.scrollTo({
    top: 0,
    left: maxScrollLeft,
    behavior: 'smooth'
   });
   } else {
    container.scrollTo({
    top: 0,
    left: offset-gap,
    behavior: 'smooth'
   });
   }
  }

  export function prev() {
   if(current == 0) return
   current--
   const container = root.querySelector("#esenlerotogariCarousel")
   const elementzort = container.children[current]
   const offset = elementzort.offsetLeft
   if(nearCollision(current, "left") === true) {
    container.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
   })
   current = 0
   } else {
    container.scrollTo({
    top: 0,
    left: (offset-gap)+difference,
    behavior: 'smooth'
   })
   }
  }
</script>

<div bind:this={root}>
 <div id="esenlerotogariCarousel" style="gap: {gap}px">

  <slot></slot>
 
 </div>
</div>


<style>
 #esenlerotogariCarousel {
  display: flex;
flex-wrap: nowrap;
overflow-x: scroll;
 }

 :global(#esenlerotogariCarousel > *) {
  flex-shrink: 0;
 }
</style>