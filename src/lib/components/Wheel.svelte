<script lang="ts">
  import { onMount } from 'svelte'
  import { wheelStore } from '$lib/stores/WheelStore'
  import Wheel, { type Entry } from '$lib/utils/Wheel'
  import WheelPainter from '$lib/utils/WheelPainter'
  import Ticker from '$lib/utils/Ticker'

  let canvas: HTMLCanvasElement
  let context: CanvasRenderingContext2D

  const onStopped = (winner: Entry) => console.log('winner:', winner.text)
  const wheel = new Wheel({ ...$wheelStore, onStopped })
  const painter = new WheelPainter()
  const ticker = new Ticker()
  let animationFrameId = 0

  const refreshPainter = () => {
    painter.refresh()
    if (context) painter.draw(context, wheel)
  }

  const refreshPainterOnFontLoad = async () => {
    await document.fonts.load('16px Quicksand')
    refreshPainter()
  }

  onMount(() => {
    context = canvas.getContext('2d')!
    refreshPainterOnFontLoad()
    tick(0)
  })

  $: {
    wheel.setConfig($wheelStore.config)
    refreshPainter()
  }
  $: {
    wheel.setEntries($wheelStore.entries)
    refreshPainter()
  }

  const click = (e: MouseEvent) => {
    const center = canvas.clientWidth / 2
    const { x, y } = { x: e.offsetX - center, y: e.offsetY - center }
    if ((x ** 2 + y ** 2) ** 0.5 > center * 0.85) return
    wheel.click()
  }

  const tick = (ms: number) => {
    ticker.catchUp(ms, () => wheel.tick())
    painter.draw(context, wheel)
    animationFrameId = requestAnimationFrame(tick)
  }
</script>

<div class="flex-1 aspect-square max-w-full">
  <canvas
    width="700"
    height="700"
    bind:this={canvas}
    on:click={click}
    class="w-full h-auto"
  />
</div>
