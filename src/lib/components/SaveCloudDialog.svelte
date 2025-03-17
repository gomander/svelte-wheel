<script lang="ts">
  import { getContext } from 'svelte'
  import { ProgressRing, type ToastContext } from '@skeletonlabs/skeleton-svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import { createWheel, getWheel, updateWheel } from '$lib/utils/Api'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { getStringFromError } from '$lib/utils/General'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open() {
    const user = getCurrentUser()
    if (!user) {
      onNotLoggedIn()
      return
    }
    if (wheelStore.path) {
      loading = true
      getWheel(wheelStore.path, user.uid).then((response) => {
        if (!response.success) throw new Error(response.error.message)
        saveMode = 'overwrite'
      }).catch((error) => {
        toast.create({
          ...toastDefaults,
          description: getStringFromError(error),
          type: 'error'
        })
        wheelStore.path = null
      }).finally(() => {
        loading = false
      })
    }
    dialog.open()
  }

  let { onNotLoggedIn }: { onNotLoggedIn: () => void } = $props()

  const toast: ToastContext = getContext('toast')

  let title = $state(wheelStore.config.title)
  let loading = $state(false)
  let saveMode: 'overwrite' | 'new' = $state('new')
  let dialog: AppDialog = $state(null!)

  async function save(e: Event) {
    e.preventDefault()
    if (loading) return
    loading = true
    try {
      if (!title) throw new Error('Title is required')
      const user = getCurrentUser()
      if (!user) throw new Error('User is not logged in')
      if (saveMode === 'new') {
        const response = await createWheel({
          wheel: {
            config: { ...wheelStore.config, title },
            entries: wheelStore.entries
          },
          visibility: 'private',
          uid: user.uid
        }, user.uid)
        if (!response.success) throw new Error(response.error.message)
      }
      if (saveMode === 'overwrite' && wheelStore.path) {
        const response = await updateWheel(wheelStore.path, {
          wheel: {
            config: { ...wheelStore.config, title },
            entries: wheelStore.entries
          },
          uid: user.uid
        }, user.uid)
        if (!response.success) throw new Error(response.error.message)
      }
      close()
      toast.create({
        ...toastDefaults,
        description: 'Wheel saved',
        type: 'success'
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

  // TODO: When wheelStore has a path, the user should be shown as much metadata
  // about the wheel as possible, such as the title, number of entries, and date
  // created. Additionally, there should be a thumbnail of the wheel, the same
  // one that would be shown in the open cloud dialog.
</script>

<AppDialog bind:this={dialog}>
  <article class="p-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk"></i>
      <h1>Save a wheel</h1>
    </header>

    <form
      onsubmit={save}
      class="flex flex-col gap-4"
    >
      {#if wheelStore.path}
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2">
            <input
              type="radio"
              name="saveMode"
              value="overwrite"
              bind:group={saveMode}
              class="radio"
            >
            <span>
              Overwrite "{wheelStore.config.title}" ({wheelStore.path})
            </span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              name="saveMode"
              value="new"
              bind:group={saveMode}
              checked
              class="radio"
            >
            <span>Save a new wheel</span>
          </label>
        </div>
      {/if}

      <label class="label">
        <span class="required">Title</span>
        <input
          type="text"
          maxlength="50"
          required
          bind:value={title}
          placeholder="Enter a title for your wheel"
          class="input"
        >
      </label>

      <footer class="flex justify-end gap-2">
        <button
          type="button"
          class="btn preset-tonal"
          onclick={close}
        >
          Cancel
        </button>

        <button
          class="btn preset-filled-primary-500"
          aria-busy={loading}
        >
          {#if loading}
            <ProgressRing size="w-6" />
          {:else}
            Save
          {/if}
        </button>
      </footer>
    </form>
  </article>
</AppDialog>
