<script lang="ts">
  import { onMount } from 'svelte'
  import {
    ProgressRadial, getModalStore, getToastStore
  } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { createWheel, getWheel, updateWheel } from '$lib/utils/Api'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let title = $state(wheelStore.config.title)
  let loading = $state(false)
  let saveMode: 'overwrite' | 'new' = $state('new')

  onMount(async () => {
    const user = getCurrentUser()
    if (!user) {
      modalStore.close()
      modalStore.trigger({
        type: 'component',
        component: 'loginDialog',
        meta: { next: 'saveCloudDialog' }
      })
      return
    }
    if (wheelStore.path) {
      loading = true
      try {
        const response = await getWheel(wheelStore.path, user.uid)
        if (!response.success) {
          wheelStore.path = null
          return
        }
        saveMode = 'overwrite'
      } catch (error) {
        wheelStore.path = null
      } finally {
        loading = false
      }
    }
  })

  const save = async (e: Event) => {
    e.preventDefault()
    if (loading) return
    loading = true
    try {
      if (!title) {
        throw new Error('Title is required')
      }
      const user = getCurrentUser()
      if (!user) {
        throw new Error('User is not logged in')
      }
      if (saveMode === 'new') {
        const response = await createWheel({
          wheel: {
            config: { ...wheelStore.config, title },
            entries: wheelStore.entries
          },
          visibility: 'private',
          uid: user.uid
        }, user.uid)
        if (!response.success) {
          throw new Error(response.error.message)
        }
      }
      if (saveMode === 'overwrite' && wheelStore.path) {
        const response = await updateWheel(wheelStore.path, {
          wheel: {
            config: { ...wheelStore.config, title },
            entries: wheelStore.entries
          },
          uid: user.uid
        }, user.uid)
        if (!response.success) {
          throw new Error(response.error.message)
        }
      }
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

  // TODO: When wheelStore has a path, the user should be shown as much metadata
  // about the wheel as possible, such as the title, number of entries, and date
  // created. Additionally, there should be a thumbnail of the wheel, the same
  // one that would be shown in the open cloud dialog.
</script>

{#if $modalStore[0]}
  <article class="card w-modal-slim p-4 shadow-xl overflow-hidden flex flex-col gap-4">
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
          class="btn variant-soft"
          onclick={modalStore.close}
        >
          Cancel
        </button>

        <button
          class="btn variant-filled-primary"
          aria-busy={loading}
        >
          {#if loading}
            <ProgressRadial width="w-6" />
          {:else}
            Save
          {/if}
        </button>
      </footer>
    </form>
  </article>
{/if}
