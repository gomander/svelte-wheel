<script lang="ts">
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import Wheel from '$lib/components/Wheel.svelte'
  import { launchConfetti } from '$lib/utils/ConfettiLauncher'
  import type { OnStoppedData } from '$lib/utils/Wheel'

  export let data
  const { wheel } = data

  const modalStore = getModalStore()

	const createWinnerModal = (data: OnStoppedData): ModalSettings => ({
    type: 'component',
    component: 'winnerDialog',
    title: $wheelStore.config.winnerMessage || 'We have a winner!',
    body: data.winner.text,
    meta: data
  })

	const openWinnerModal = async (e: CustomEvent<OnStoppedData>) => {
    launchConfetti($wheelStore.config.confetti, $wheelStore.config.colors)
		if (!$wheelStore.config.displayWinnerDialog) return
		modalStore.trigger(createWinnerModal(e.detail))
	}

  wheelStore.setConfig(wheel.config)
  wheelStore.setEntries(wheel.entries)
</script>

<svelte:head>
  <title>{wheel.config.title} - Svelte Wheel</title>
  <meta name="title" content={wheel.config.title} />
  <meta property="og:title" content={wheel.config.title} />
  {#if wheel.config.description}
    <meta name="description" content={wheel.config.description} />
    <meta property="og:description" content={wheel.config.description} />
  {/if}
  <!-- <meta
    property="og:image"
    content="https://sveltewheel.com/thumbnails/{wheel.path}"
  /> -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="{wheel.config.colors.at(0)}">
</svelte:head>

<div class="min-h-screen flex flex-col">
  <main class="flex-grow flex flex-col xl:grid grid-cols-6">
    <div class="col-span-1 pb-0 p-4 xl:pb-4 xl:pr-0 flex flex-col">
      <h2 class="text-3xl">{wheel.config.title}</h2>
      <p class="text-lg">{wheel.config.description}</p>
    </div>

    <div class="col-span-4 flex-1 flex flex-col justify-center items-center">
      <Wheel on:stop={openWinnerModal} />
    </div>

    <div class="col-span-1 pt-0 p-4 xl:pt-4 xl:pl-0"></div>
  </main>
</div>
