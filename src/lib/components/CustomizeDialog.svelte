<script lang="ts">
  import { getModalStore, TabGroup, Tab } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import CustomizeDialogBasic from '$lib/components/CustomizeDialogBasic.svelte'
  import CustomizeDialogAppearance from '$lib/components/CustomizeDialogAppearance.svelte'
  import CustomizeDialogDuringSpin from '$lib/components/CustomizeDialogDuringSpin.svelte'
  import CustomizeDialogAfterSpin from '$lib/components/CustomizeDialogAfterSpin.svelte'

  const modalStore = getModalStore()

  const config = $state($state.snapshot(wheelStore.config))
  let openTab = $state('basic')

  const save = () => {
    if (config.type === 'image' && !config.image) config.type = 'color'
    wheelStore.config = config
    modalStore.close()
  }
</script>

{#if $modalStore[0]}
  <article class="p-4 card w-modal flex flex-col gap-4 shadow-xl">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-palette"></i>
      <h1>Customize</h1>
    </header>

    <TabGroup
      class="flex-1 flex flex-col"
      regionPanel="flex-1 flex flex-col gap-4 min-h-48"
    >
      <Tab bind:group={openTab} name="basic" value="basic">
        Basic
      </Tab>
      <Tab bind:group={openTab} name="appearance" value="appearance">
        Appearance
      </Tab>
      <Tab bind:group={openTab} name="duringSpin" value="duringSpin">
        During spin
      </Tab>
      <Tab bind:group={openTab} name="afterSpin" value="afterSpin">
        After spin
      </Tab>

      {#snippet panel()}
        {#if openTab === 'basic'}
          <CustomizeDialogBasic
            bind:title={config.title}
            bind:description={config.description}
            bind:spinTime={config.spinTime}
          />
        {:else if openTab === 'appearance'}
          <CustomizeDialogAppearance
            bind:type={config.type}
            bind:colors={config.colors}
            bind:image={config.image}
            bind:hubSize={config.hubSize}
          />
        {:else if openTab === 'duringSpin'}
          <CustomizeDialogDuringSpin
            bind:duringSpinSound={config.duringSpinSound}
            bind:indefiniteSpin={config.indefiniteSpin}
          />
        {:else if openTab === 'afterSpin'}
          <CustomizeDialogAfterSpin
            bind:afterSpinSound={config.afterSpinSound}
            bind:displayWinnerDialog={config.displayWinnerDialog}
            bind:winnerMessage={config.winnerMessage}
            bind:confetti={config.confetti}
          />
        {/if}
      {/snippet}
    </TabGroup>

    <footer class="flex justify-end gap-2">
      <button class="btn variant-soft" onclick={modalStore.close}>
        Cancel
      </button>
      <button class="btn variant-filled-primary" onclick={save}>
        Save
      </button>
    </footer>
  </article>
{/if}
