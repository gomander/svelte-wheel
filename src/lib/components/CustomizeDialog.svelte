<script lang="ts">
  import { getModalStore, TabGroup, Tab } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import CustomizeDialogBasic from '$lib/components/CustomizeDialogBasic.svelte'
  import CustomizeDialogAppearance from '$lib/components/CustomizeDialogAppearance.svelte'
  import CustomizeDialogDuringSpin from '$lib/components/CustomizeDialogDuringSpin.svelte'
  import CustomizeDialogAfterSpin from '$lib/components/CustomizeDialogAfterSpin.svelte'

  const modalStore = getModalStore()

  const config = structuredClone($wheelStore.config)
  let openTab = 'basic'

  const save = () => {
    if (config.type === 'image' && !config.image) config.type = 'color'
    wheelStore.setConfig(config)
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

      <svelte:fragment slot="panel">
        {#if openTab === 'basic'}
          <CustomizeDialogBasic {config} />
        {:else if openTab === 'appearance'}
          <CustomizeDialogAppearance {config} />
        {:else if openTab === 'duringSpin'}
          <CustomizeDialogDuringSpin {config} />
        {:else if openTab === 'afterSpin'}
          <CustomizeDialogAfterSpin {config} />
        {/if}
      </svelte:fragment>
    </TabGroup>

    <footer class="flex justify-end gap-2">
      <button class="btn variant-soft" on:click={modalStore.close}>
        Cancel
      </button>
      <button class="btn variant-filled-primary" on:click={save}>
        Save
      </button>
    </footer>
  </article>
{/if}
