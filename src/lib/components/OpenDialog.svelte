<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { fileOpen } from 'browser-fs-access'
  import wheelStore from '$lib/stores/WheelStore'
  import { toastDefaults } from '$lib/utils/Toast'

  // TODO: Implement modal

  const toast: ToastContext = getContext('toast')

  const openOpenCloudDialog = () => {
    close()
    // modalStore.trigger({ type: 'component', component: 'openCloudDialog' })
  }

  const openLocalFile = async () => {
    try {
      const file = await fileOpen({
        mimeTypes: ['application/json'],
        extensions: ['.wheel']
      })
      const fileContent = await file.text()
      const { config, entries, winners } = JSON.parse(fileContent)
      wheelStore.config = config
      wheelStore.entries = entries
      wheelStore.winners = winners
      close()
      toast.create({
        ...toastDefaults,
        description: 'Wheel loaded successfully!'
      })
    } catch (e) {
      console.error(e)
      toast.create({
        ...toastDefaults,
        description: 'Error loading wheel',
        type: 'error'
      })
    }
  }

  function close() {
    // modalStore.close()
  }
</script>

{#if false}
  <article class="card w-modal-slim shadow-xl overflow-hidden">
    <header class="p-4 text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-folder-open"></i>
      <h1>Open a wheel</h1>
    </header>

    <div class="px-4 flex flex-col gap-4">
      <button
        class="btn preset-filled-primary-500 flex flex-col gap-2"
        onclick={openOpenCloudDialog}
      >
        <i class="fas fa-cloud text-4xl"></i>
        <span>Open from the cloud</span>
      </button>

      <button
        class="btn preset-filled"
        onclick={openLocalFile}
      >
        <i class="fas fa-hard-drive text-4xl"></i>
        <span>Open a local file</span>
      </button>
    </div>

    <footer class="p-4 flex justify-end gap-2 md:gap-4">
      <button
        class="btn preset-tonal"
        onclick={close}
      >
        Cancel
      </button>
    </footer>
  </article>
{/if}
