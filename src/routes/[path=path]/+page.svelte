<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import { launchConfetti } from '$lib/utils/ConfettiLauncher'
  import type { OnStoppedData } from '$lib/utils/Wheel'
  import WinnerDialog from '$lib/components/WinnerDialog.svelte'
  import Wheel from '$lib/components/Wheel.svelte'

  let { data } = $props()
  const { wheel } = data

  let winnerDialog: WinnerDialog = $state(null!)

  function onStop(data: OnStoppedData) {
    launchConfetti(
      wheelStore.config.confetti,
      $state.snapshot(wheelStore.config.colors)
    )
    if (!wheelStore.config.displayWinnerDialog) return
    winnerDialog.open(data.winner, wheelStore.config.winnerMessage, data.color)
  }

  wheelStore.config = wheel.config
  wheelStore.setNewEntries(wheel.entries)
</script>

<svelte:head>
  <title>{wheel.config.title} - Svelte Wheel</title>
  <meta name="title" content={wheel.config.title}>
  <meta property="og:title" content={wheel.config.title}>
  {#if wheel.config.description}
    <meta name="description" content={wheel.config.description}>
    <meta property="og:description" content={wheel.config.description}>
  {:else}
    <meta
      name="description"
      content="Spin this custom wheel and get a random result!"
    >
    <meta
      property="og:description"
      content="Spin this custom wheel and get a random result!"
    >
  {/if}
  <meta property="og:url" content="https://sveltewheel.com/{wheel.path}">
  <meta
    property="og:image"
    content="https://sveltewheel.com/thumbnails/{wheel.path}"
  >
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content={wheel.config.colors.at(0)}>
</svelte:head>

<div class="min-h-screen flex flex-col">
  <main class="grow flex flex-col xl:grid grid-cols-6">
    <div class="col-span-1 pb-0 p-4 xl:pb-4 xl:pr-0 flex flex-col">
      <h2 class="text-3xl">{wheel.config.title}</h2>
      <p class="text-lg">{wheel.config.description}</p>
    </div>

    <div class="col-span-4 flex-1 flex flex-col justify-center items-center">
      <Wheel {onStop} />
    </div>

    <div class="col-span-1 pt-0 p-4 xl:pt-4 xl:pl-0"></div>
  </main>
</div>

<WinnerDialog bind:this={winnerDialog} />
