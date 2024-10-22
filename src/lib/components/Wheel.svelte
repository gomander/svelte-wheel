<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import busyStore from '$lib/stores/BusyStore'
  import Wheel, { type OnStoppedData } from '$lib/utils/Wheel'
  import WheelPainter from '$lib/utils/WheelPainter'
  import Ticker from '$lib/utils/Ticker'
  import {
    playTick, playSound, playLoopedSound, cancelLoopingSounds
  } from '$lib/utils/Audio'

  const dispatch = createEventDispatcher<{ stop: OnStoppedData }>()

  let canvas: HTMLCanvasElement = $state(null!)
  let context: CanvasRenderingContext2D = $state(null!)

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
    wheelStore.setWinners([...wheelStore.value.winners, data.winner])
  }
  const wheel = new Wheel({ ...wheelStore.value, onStarted, onStopped })
  const painter = new WheelPainter()
  const ticker = new Ticker()

  const refreshPainter = () => {
    painter.refresh()
    if (context) {
      painter.draw(context, wheel)
    }
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

  $effect(() => {
    wheel.setConfig(wheelStore.value.config)
    refreshPainter()
  })
  $effect(() => {
    wheel.setEntries(wheelStore.value.entries)
    refreshPainter()
  })

  const click = (e: MouseEvent | KeyboardEvent) => {
    if (e instanceof MouseEvent) {
      const center = canvas.clientWidth / 2
      const { x, y } = { x: e.offsetX - center, y: e.offsetY - center }
      if ((x ** 2 + y ** 2) ** 0.5 > center * 0.85) return
    }
    if (e instanceof KeyboardEvent) {
      if (!['Enter', ' '].includes(e.key)) return
      e.preventDefault()
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
    onclick={click}
    onkeydown={click}
    class="w-full h-auto rounded-full outline-offset-[-1rem]"
    aria-label="Wheel"
    tabindex="0"
  ></canvas>
</div>
