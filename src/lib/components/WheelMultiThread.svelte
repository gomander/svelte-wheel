<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import busyStore from '$lib/stores/BusyStore'
  import Wheel, { type OnStoppedData } from '$lib/utils/Wheel'
  import Ticker from '$lib/utils/Ticker'
  import {
    playTick, playSound, playLoopedSound, cancelLoopingSounds
  } from '$lib/utils/Audio'

  const dispatch = createEventDispatcher<{ stop: OnStoppedData }>()

  const onStarted = () => {
    busyStore.setSpinning(true)
    if (wheel.config.duringSpinSound === 'tick') {
      wheel.onPointerIndexChanged = () => {
        playTick(wheel.config.duringSpinSoundVolume)
      }
    } else {
      delete wheel.onPointerIndexChanged
      if (wheel.config.duringSpinSound) {
        playLoopedSound(
          wheel.config.duringSpinSound, wheel.config.duringSpinSoundVolume
        )
      }
    }
  }
  const onStopped = (data: OnStoppedData) => {
    busyStore.setSpinning(false)
    cancelLoopingSounds()
    if (wheel.config.afterSpinSound) {
      playSound(wheel.config.afterSpinSound, wheel.config.afterSpinSoundVolume)
    }
    dispatch('stop', data)
    wheelStore.setWinners([...$wheelStore.winners, data.winner])
  }

  let canvas: HTMLCanvasElement
  let offscreen: OffscreenCanvas
  let painter: Worker
  const wheel = new Wheel({ ...$wheelStore, onStarted, onStopped })
  const ticker = new Ticker()
  let animationFrameId = 0

  const loadWheelPainterWorker = async () => {
    const WheelPainterWorker = await import('$lib/utils/WheelPainterWorker?worker')
    painter = new WheelPainterWorker.default()
    offscreen = canvas.transferControlToOffscreen()
    painter.postMessage({ canvas: offscreen }, [offscreen])
    painter.postMessage({ wheel: $wheelStore })
    refreshWheelOnFontLoad()
    tick(0)
  }

  const refreshWheelOnFontLoad = async () => {
    await document.fonts.load('16px Quicksand')
    await document.fonts.ready
    painter.postMessage({ refresh: true })
  }

  onMount(loadWheelPainterWorker)

  $: {
    wheel.setConfig($wheelStore.config)
    painter?.postMessage({ config: wheel.config })
    painter?.postMessage({ refresh: true })
  }
  $: {
    wheel.setEntries($wheelStore.entries)
    painter?.postMessage({ entries: wheel.entries })
    painter?.postMessage({ refresh: true })
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
    painter?.postMessage({ angle: wheel.state.angle })
    animationFrameId = requestAnimationFrame(tick)
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
