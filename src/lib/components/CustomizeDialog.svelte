<script lang="ts">
  import { Tabs } from '@skeletonlabs/skeleton-svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import type WheelConfig from '$lib/utils/WheelConfig'
  import AppDialog from '$lib/components/AppDialog.svelte'
  import CustomizeDialogBasic from '$lib/components/CustomizeDialogBasic.svelte'
  import CustomizeDialogAppearance from '$lib/components/CustomizeDialogAppearance.svelte'
  import CustomizeDialogDuringSpin from '$lib/components/CustomizeDialogDuringSpin.svelte'
  import CustomizeDialogAfterSpin from '$lib/components/CustomizeDialogAfterSpin.svelte'

  export function open() {
    config = $state.snapshot(wheelStore.config)
    dialog.open()
  }

  let dialog: AppDialog = $state(null!)
  let config: WheelConfig = $state($state.snapshot(wheelStore.config))

  function save() {
    if (config.type === 'image' && !config.image) config.type = 'color'
    wheelStore.config = config
    close()
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
  <article class="p-4 card w-modal flex flex-col gap-4 shadow-xl">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-palette"></i>
      <h1>Customize</h1>
    </header>

    <Tabs defaultValue="basic">
      <Tabs.List>
        <Tabs.Trigger value="basic">Basic</Tabs.Trigger>
        <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
        <Tabs.Trigger value="duringSpin">During spin</Tabs.Trigger>
        <Tabs.Trigger value="afterSpin">After spin</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="basic">
        <CustomizeDialogBasic
          bind:title={config.title}
          bind:description={config.description}
          bind:spinTime={config.spinTime}
        />
      </Tabs.Content>
      <Tabs.Content value="appearance">
        <CustomizeDialogAppearance
          bind:type={config.type}
          bind:colors={config.colors}
          bind:image={config.image}
          bind:hubSize={config.hubSize}
        />
      </Tabs.Content>
      <Tabs.Content value="duringSpin">
        <CustomizeDialogDuringSpin
          bind:duringSpinSound={config.duringSpinSound}
          bind:indefiniteSpin={config.indefiniteSpin}
        />
      </Tabs.Content>
      <Tabs.Content value="afterSpin">
        <CustomizeDialogAfterSpin
          bind:afterSpinSound={config.afterSpinSound}
          bind:displayWinnerDialog={config.displayWinnerDialog}
          bind:winnerMessage={config.winnerMessage}
          bind:confetti={config.confetti}
        />
      </Tabs.Content>
    </Tabs>

    <footer class="flex justify-end gap-2">
      <button class="btn preset-tonal" onclick={close}> Cancel </button>
      <button class="btn preset-filled-primary-500" onclick={save}>
        Save
      </button>
    </footer>
  </article>
</AppDialog>
