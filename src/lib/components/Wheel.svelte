<script lang="ts">
  import { onMount } from 'svelte'
  import Wheel from '$lib/utils/Wheel'

  let canvas: HTMLCanvasElement
  const wheel = new Wheel()

  onMount(() => {
    const context = canvas.getContext('2d')!
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'white'
    context.font = '20px monospace'
    context.fillText(JSON.stringify(wheel), 0, 20)
  })
</script>

<canvas
  width="700"
  height="700"
  bind:this={canvas}
/>
