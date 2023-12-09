<script lang="ts">
  import { onMount } from 'svelte'

  let canvas: HTMLCanvasElement

  onMount(() => {
    const context = canvas.getContext('2d')!
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
  })
</script>

<canvas
  width="700"
  height="700"
  bind:this={canvas}
/>
