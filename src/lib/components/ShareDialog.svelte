<script lang="ts">
  import { getContext } from 'svelte'
  import { ProgressRing, type ToastContext } from '@skeletonlabs/skeleton-svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { createWheel, getWheel, updateWheel } from '$lib/utils/Api'
  import { getStringFromError } from '$lib/utils/General'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open() {
    const user = getCurrentUser()
    if (!user) {
      close()
      onNotLoggedIn()
      return
    }
    if (wheelStore.path) {
      loading = true
      getWheel(wheelStore.path, user.uid).then((response) => {
        if (!response.success) {
          wheelStore.path = null
          return
        }
        shareMode = 'overwrite'
      }).catch((error) => {
        wheelStore.path = null
        toast.create({
          ...toastDefaults,
          description: getStringFromError(error),
          type: 'error'
        })
      }).finally(() => {
        loading = false
      })
    }
    dialog.open()
  }

  let { onNotLoggedIn, onShare }: {
    onNotLoggedIn: () => void
    onShare: (path: string) => void
  } = $props()

  const toast: ToastContext = getContext('toast')

  let title = $state(wheelStore.config.title)
  let loading = $state(false)
  let shareMode: 'overwrite' | 'new' = $state('new')
  let dialog: AppDialog = $state(null!)

  async function share(e: Event) {
    e.preventDefault()
    if (loading) return
    loading = true
    try {
      if (!title) throw new Error('Title is required')
      const user = getCurrentUser()
      if (!user) throw new Error('User is not logged in')
      let path: string | null = null
      if (shareMode === 'new') {
        const response = await createWheel({
          wheel: {
            config: { ...wheelStore.config, title },
            entries: wheelStore.entries
          },
          visibility: 'public',
          uid: user.uid
        }, user.uid)
        if (!response.success) throw new Error(response.error.message)
        path = response.data.path
      }
      if (shareMode === 'overwrite' && wheelStore.path) {
        const response = await updateWheel(wheelStore.path, {
          wheel: {
            config: { ...wheelStore.config, title },
            entries: wheelStore.entries
          },
          uid: user.uid,
          visibility: 'public'
        }, user.uid)
        if (!response.success) throw new Error(response.error.message)
        path = response.data.path
      }
      if (!path) throw new Error('Could not share wheel')
      close()
      onShare(path)
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
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-share-nodes"></i>
      <h1>Share wheel</h1>
    </header>

    <section class="flex flex-col gap-2">
      <p>
        Sharing a wheel will make it public for anyone to see and spin if they
        have the link.
      </p>
      <p>
        Others will not be able to edit the wheel, nor will they be able to see
        changes you make after sharing.
      </p>
      <p>
        Each person who opens the wheel will be able to spin it as many times as
        they want, and their results will be independent of anyone else's.
      </p>
    </section>

    <form
      onsubmit={share}
      class="flex flex-col gap-4"
    >
      {#if wheelStore.path}
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2">
            <input
              type="radio"
              name="saveMode"
              value="overwrite"
              bind:group={shareMode}
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
              bind:group={shareMode}
              checked
              class="radio"
            >
            <span>Share as a new wheel</span>
          </label>
        </div>
      {/if}

      <label class="label">
        <span class="required">Title</span>
        <input
          type="text"
          name="title"
          required
          maxlength="50"
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
            Share
          {/if}
        </button>
      </footer>
    </form>
  </article>
</AppDialog>
