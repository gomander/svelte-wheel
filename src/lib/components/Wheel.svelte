<script lang="ts">
  import { onMount } from 'svelte'
  import Wheel from '$lib/utils/Wheel'
  import WheelPainter from '$lib/utils/WheelPainter'

  let canvas: HTMLCanvasElement
  const wheel = new Wheel()
  const painter = new WheelPainter()

  onMount(() => {
    const context = canvas.getContext('2d')!
    painter.draw(context, wheel)
  })
</script>

<canvas
  width="700"
  height="700"
  bind:this={canvas}
/>
