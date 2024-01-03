<script lang="ts">
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import Wheel from '$lib/components/Wheel.svelte'
  import { launchConfetti } from '$lib/utils/ConfettiLauncher'
  import type { OnStoppedData } from '$lib/utils/Wheel'

  export let data

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

  wheelStore.setConfig(data.wheel.config)
  wheelStore.setEntries(data.wheel.entries)
</script>

<svelte:head>
  <title>{data.wheel.config.title} - Svelte Wheel</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
  <main class="flex-grow flex flex-col xl:grid grid-cols-6">
    <div class="col-span-1 pb-0 p-4 xl:pb-4 xl:pr-0 flex flex-col">
      <h2 class="text-3xl">{data.wheel.config.title}</h2>
      <p class="text-lg">{data.wheel.config.description}</p>
    </div>

    <div class="col-span-4 flex-1 flex flex-col justify-center items-center">
      <Wheel on:stop={openWinnerModal} />
    </div>

    <div class="col-span-1 pt-0 p-4 xl:pt-4 xl:pl-0"></div>
  </main>
</div>
