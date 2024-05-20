<script lang="ts">
  import {
    RadioGroup, RadioItem, getModalStore, type ModalSettings
  } from '@skeletonlabs/skeleton'
  import Toolbar from '$lib/components/Toolbar.svelte'
  import Wheel from '$lib/components/Wheel.svelte'
  import WheelMultiThread from '$lib/components/WheelMultiThread.svelte'
  import EditorColumn from '$lib/components/EditorColumn.svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import fullscreenStore from '$lib/stores/FullscreenStore'
  import debugStore from '$lib/stores/DebugStore'
  import { launchConfetti } from '$lib/utils/ConfettiLauncher'
  import type { OnStoppedData } from '$lib/utils/Wheel'
  import AboutCards from '$lib/components/AboutCards.svelte'

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

  const openOpenDialog = () => modalStore.trigger({
    type: 'component', component: 'openDialog'
  })

  const openSaveDialog = () => modalStore.trigger({
    type: 'component', component: 'saveDialog'
  })

  const openCustomizeDialog = () => modalStore.trigger({
    type: 'component', component: 'customizeDialog'
  })

  const openShareDialog = () => modalStore.trigger({
    type: 'component', component: 'shareDialog'
  })

  const openAccountDialog = async () => modalStore.trigger({
    type: 'component', component: 'accountDialog'
  })

  let WheelComponent = Wheel
</script>

<svelte:head>
  {#if $wheelStore.config.title}
    <title>{$wheelStore.config.title} - Svelte Wheel</title>
  {:else}
    <title>Svelte Wheel</title>
  {/if}
  <meta
    property="og:image"
    content="https://sveltewheel.com/images/sveltewheel.webp"
  >
  <meta name="theme-color" content="#022a4f">
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Toolbar
    on:new={wheelStore.reset}
    on:open={openOpenDialog}
    on:save={openSaveDialog}
    on:customize={openCustomizeDialog}
    on:share={openShareDialog}
    on:account={openAccountDialog}
    on:debug={debugStore.toggle}
  />

  <main class="flex-grow flex flex-col xl:grid grid-cols-4">
    <div class="col-span-1 pb-0 p-4 xl:pb-4 xl:pr-0 flex flex-col justify-between">
      {#if !$fullscreenStore.active}
        <div>
          <h2 class="text-3xl" aria-label="Wheel title">
            {$wheelStore.config.title}
          </h2>
          <p class="text-lg" aria-label="Wheel description">
            {$wheelStore.config.description}
          </p>
          {#if $debugStore.active}
            <RadioGroup>
              <RadioItem
                name="wheel"
                value={Wheel}
                bind:group={WheelComponent}
              >
                Single Thread
              </RadioItem>
              <RadioItem
                name="wheel"
                value={WheelMultiThread}
                bind:group={WheelComponent}
              >
                Multi Thread
              </RadioItem>
            </RadioGroup>
          {/if}
        </div>

        <p class="hidden xl:block sticky bottom-4 text-sm" aria-hidden="true">
          Scroll down to read about this project!
        </p>
      {/if}
    </div>

    <div class="col-span-2 flex-1 flex flex-col justify-center items-center">
      <svelte:component
        this={WheelComponent}
        on:stop={openWinnerModal}
      />
    </div>

    <div class="col-span-1 pt-0 p-4 xl:pt-4 xl:pl-0 flex flex-col">
      {#if !$fullscreenStore.active}
        <EditorColumn />
      {/if}
    </div>
  </main>
</div>

{#if !$fullscreenStore.active}
  <hr>

  <aside class="p-4 flex justify-center">
    <AboutCards />
  </aside>
{/if}
