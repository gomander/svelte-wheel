<script lang="ts">
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { fileSave } from 'browser-fs-access'
  import wheelStore from '$lib/stores/WheelStore'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let fileName = $state(wheelStore.config.title)
  let loading = false

  const save = async (e: Event) => {
    e.preventDefault()
    if (loading) return
    loading = true
    try {
      await fileSave(
        new Blob(
          [JSON.stringify({
            config: wheelStore.config,
            entries: wheelStore.entries,
            winners: wheelStore.winners
          })],
          { type: 'application/json' }
        ),
        { fileName: `${fileName || 'Untitled'}.wheel`, extensions: ['.wheel'] }
      )
      modalStore.close()
      toastStore.trigger({
        ...toastDefaults,
        message: 'Wheel saved',
        background: 'variant-filled-primary'
      })
    } catch (error) {
      if (error instanceof Error) {
        toastStore.trigger({
          ...toastDefaults,
          message: error.message,
          background: 'variant-filled-error'
        })
      }
    } finally {
      loading = false
    }
  }
</script>

{#if $modalStore[0]}
  <article class="card w-modal-slim shadow-xl overflow-hidden">
    <header class="p-4 text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk"></i>
      <h1>Save a wheel</h1>
    </header>

    <form
      onsubmit={save}
      class="px-4 flex flex-col gap-4"
    >
      <label class="label">
        <span>File name</span>

        <div class="input-group grid-cols-[1fr_auto]">
          <input
            type="text"
            maxlength="50"
            bind:value={fileName}
            placeholder="Untitled"
          >

          <div>.wheel</div>
        </div>
      </label>
    </form>

    <footer class="p-4 flex justify-end gap-2 md:gap-4">
      <button
        class="btn variant-soft"
        onclick={modalStore.close}
      >
        Cancel
      </button>

      <button
        class="btn variant-filled-primary"
        onclick={save}
      >
        Save
      </button>
    </footer>
  </article>
{/if}
