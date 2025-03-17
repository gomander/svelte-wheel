<script lang="ts">
  // TODO: Implement modal

  const openSaveCloudDialog = () => {
    close()
    // modalStore.trigger({ type: 'component', component: 'saveCloudDialog' })
  }

  const openSaveLocalDialog = () => {
    close()
    // modalStore.trigger({ type: 'component', component: 'saveLocalDialog' })
  }

  function close() {
    // modalStore.close()
  }
</script>

{#if false}
  <article class="card w-modal-slim shadow-xl overflow-hidden">
    <header class="p-4 text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk"></i>
      <h1>Save a wheel</h1>
    </header>

    <div class="px-4 flex flex-col gap-4">
      <button
        class="btn preset-filled-primary-500 flex flex-col gap-2"
        onclick={openSaveCloudDialog}
      >
        <i class="fas fa-cloud text-4xl"></i>
        <span>Save to the cloud</span>
      </button>

      <button
        class="btn preset-filled"
        onclick={openSaveLocalDialog}
      >
        <i class="fas fa-hard-drive text-4xl"></i>
        <span>Save to a local file</span>
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
