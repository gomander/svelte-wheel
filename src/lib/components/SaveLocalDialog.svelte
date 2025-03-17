<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { fileSave } from 'browser-fs-access'
  import wheelStore from '$lib/stores/WheelStore'
  import { getStringFromError } from '$lib/utils/General'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open() {
    dialog.open()
  }

  const toast: ToastContext = getContext('toast')

  let fileName = $state(wheelStore.config.title)
  let dialog: AppDialog = $state(null!)
  let loading = false

  async function save(e: Event) {
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
      close()
      toast.create({
        ...toastDefaults,
        description: 'Wheel saved'
      })
    } catch (error) {
      toast.create({
        ...toastDefaults,
        description: getStringFromError(error),
        type: 'error'
      })
    } finally {
      loading = false
    }
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
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
        class="btn preset-tonal"
        onclick={close}
      >
        Cancel
      </button>

      <button
        class="btn preset-filled-primary-500"
        onclick={save}
      >
        Save
      </button>
    </footer>
  </article>
</AppDialog>
