<script lang="ts">
  import { onMount } from 'svelte'
  import Wheel from '$lib/utils/Wheel'
  import WheelPainter from '$lib/utils/WheelPainter'
  import Ticker from '$lib/utils/Ticker'

  let canvas: HTMLCanvasElement
  let context: CanvasRenderingContext2D
  const wheel = new Wheel()
  const painter = new WheelPainter()
  const ticker = new Ticker()
  let animationFrameId = 0

  onMount(() => {
    context = canvas.getContext('2d')!
    tick(0)
  })

  const tick = (ms: number) => {
    ticker.catchUp(ms, () => wheel.tick())
    painter.draw(context, wheel)
    animationFrameId = requestAnimationFrame(tick)
  }
</script>

<canvas
  width="700"
  height="700"
  bind:this={canvas}
/>
