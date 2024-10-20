<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton'

  const modalStore = getModalStore()

  const openSaveCloudDialog = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'saveCloudDialog' })
  }

  const openSaveLocalDialog = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'saveLocalDialog' })
  }
</script>

{#if $modalStore[0]}
  <article class="card w-modal-slim shadow-xl overflow-hidden">
    <header class="p-4 text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk"></i>
      <h1>Save a wheel</h1>
    </header>

    <div class="px-4 flex flex-col gap-4">
      <button
        class="btn variant-filled-primary flex flex-col gap-2"
        onclick={openSaveCloudDialog}
      >
        <i class="fas fa-cloud text-4xl"></i>
        <span>Save to the cloud</span>
      </button>

      <button
        class="btn variant-filled"
        onclick={openSaveLocalDialog}
      >
        <i class="fas fa-hard-drive text-4xl"></i>
        <span>Save to a local file</span>
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
