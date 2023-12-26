<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { wheelStore } from '$lib/stores/WheelStore'
  import Wheel, { type Entry } from '$lib/utils/Wheel'
  import WheelPainter from '$lib/utils/WheelPainter'
  import Ticker from '$lib/utils/Ticker'
  import {
    playTick, playSound, playLoopedSound, cancelLoopingSounds
  } from '$lib/utils/Audio'

  const dispatch = createEventDispatcher<{
    stop: { winner: Entry, color: string }
  }>()

  let canvas: HTMLCanvasElement
  let context: CanvasRenderingContext2D

  const onStarted = () => {
    if (wheel.config.duringSpinSound === 'tick') {
      wheel.onPointerIndexChanged = () => playTick(
        wheel.config.duringSpinSoundVolume
      )
    } else {
      delete wheel.onPointerIndexChanged
      if (wheel.config.duringSpinSound) playLoopedSound(
        wheel.config.duringSpinSound, wheel.config.duringSpinSoundVolume
      )
    }
  }
  const onStopped = (winner: Entry, color: string) => {
    cancelLoopingSounds()
    if (wheel.config.afterSpinSound) {
      playSound(wheel.config.afterSpinSound, wheel.config.afterSpinSoundVolume)
    }
    dispatch('stop', { winner, color })
    wheelStore.setWinners([...$wheelStore.winners, winner])
  }
  const wheel = new Wheel({
    ...$wheelStore, onStarted, onStopped
  })
  const painter = new WheelPainter()
  const ticker = new Ticker()

  const refreshPainter = () => {
    painter.refresh()
    if (context) painter.draw(context, wheel)
  }

  const refreshPainterOnFontLoad = async () => {
    await document.fonts.load('16px Quicksand')
    await document.fonts.ready
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

  const click = (e: MouseEvent | KeyboardEvent) => {
    if (e instanceof MouseEvent) {
      const center = canvas.clientWidth / 2
      const { x, y } = { x: e.offsetX - center, y: e.offsetY - center }
      if ((x ** 2 + y ** 2) ** 0.5 > center * 0.85) return
    }
    if (e instanceof KeyboardEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return
    }
    wheel.click()
  }

  const tick = (ms: number) => {
    ticker.catchUp(ms, () => wheel.tick())
    painter.draw(context, wheel)
    requestAnimationFrame(tick)
  }
</script>

<div class="flex-1 aspect-square max-w-full">
  <canvas
    width="700"
    height="700"
    bind:this={canvas}
    on:click={click}
    on:keydown={click}
    class="w-full h-auto rounded-full outline-offset-[-1rem]"
    aria-label="Wheel"
    tabindex="0"
  />
</div>
