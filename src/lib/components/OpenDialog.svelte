<script lang="ts">
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { fileOpen } from 'browser-fs-access'
  import wheelStore from '$lib/stores/WheelStore'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  const openOpenCloudDialog = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'openCloudDialog' })
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
      modalStore.close()
      toastStore.trigger({
        ...toastDefaults,
        message: 'Wheel loaded successfully!',
        background: 'variant-filled-primary'
      })
    } catch (e) {
      console.error(e)
      toastStore.trigger({
        ...toastDefaults,
        message: 'Error loading wheel',
        background: 'variant-filled-error'
      })
    }
  }
</script>

{#if $modalStore[0]}
  <article class="card w-modal-slim shadow-xl overflow-hidden">
    <header class="p-4 text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-folder-open"></i>
      <h1>Open a wheel</h1>
    </header>

    <div class="px-4 flex flex-col gap-4">
      <button
        class="btn variant-filled-primary flex flex-col gap-2"
        onclick={openOpenCloudDialog}
      >
        <i class="fas fa-cloud text-4xl"></i>
        <span>Open from the cloud</span>
      </button>

      <button
        class="btn variant-filled"
        onclick={openLocalFile}
      >
        <i class="fas fa-hard-drive text-4xl"></i>
        <span>Open a local file</span>
      </button>
    </div>

    <footer class="p-4 flex justify-end gap-2 md:gap-4">
      <button
        class="btn variant-soft"
        onclick={modalStore.close}
      >
        Cancel
      </button>
    </footer>
  </article>
{/if}
