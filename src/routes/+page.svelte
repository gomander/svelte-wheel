<script lang="ts">
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
  import Toolbar from '$lib/components/Toolbar.svelte'
  import Wheel from '$lib/components/Wheel.svelte'
  import EditorColumn from '$lib/components/EditorColumn.svelte'
  import { wheelStore } from '$lib/stores/WheelStore'
	import { fullscreenStore } from '$lib/stores/FullscreenStore'
  import type { Entry } from '$lib/utils/Wheel'
  import AboutCards from '$lib/components/AboutCards.svelte'

  const modalStore = getModalStore()

	const createWinnerModal = (
    data: { winner: Entry, color?: string }
  ): ModalSettings => ({
    type: 'component',
    component: 'winnerDialog',
    title: $wheelStore.config.winnerMessage,
    body: data.winner.text,
    meta: data
  })

	const openWinnerModal = async (
		e: CustomEvent<{ winner: Entry, color?: string }>
	) => {
		if (!$wheelStore.config.displayWinnerDialog) return
		modalStore.trigger(createWinnerModal(e.detail))
	}

  const openOpenDialog = () => {
    modalStore.trigger({ type: 'component', component: 'openDialog' })
  }

  const openSaveDialog = () => {
    modalStore.trigger({ type: 'component', component: 'saveDialog' })
  }
</script>

<div class="min-h-screen flex flex-col">
  <Toolbar
    on:new={wheelStore.reset}
    on:open={openOpenDialog}
    on:save={openSaveDialog}
  />

  <main class="flex-grow flex flex-col xl:grid grid-cols-4">
    <div class="col-span-1 pb-0 p-4 xl:pb-4 xl:pr-0 flex flex-col">
      {#if !$fullscreenStore.active}
        <h2 class="text-3xl" aria-label="Wheel title">
          {$wheelStore.config.title}
        </h2>
        <p class="text-lg" aria-label="Wheel description">
          {$wheelStore.config.description}
        </p>
      {/if}
    </div>

    <div class="col-span-2 flex-1 flex flex-col justify-center items-center">
      <Wheel on:stop={openWinnerModal} />
    </div>

    <div class="col-span-1 pt-0 p-4 xl:pt-4 xl:pl-0 flex flex-col">
      {#if !$fullscreenStore.active}
        <EditorColumn />
			{/if}
    </div>
  </main>
</div>

{#if !$fullscreenStore.active}
  <hr />

  <aside class="p-4 flex justify-center">
    <AboutCards />
  </aside>
{/if}
