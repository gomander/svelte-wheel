<script lang="ts">
  import {
    ProgressRadial, getModalStore, getToastStore
  } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { createWheel } from '$lib/utils/Api'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let title = $wheelStore.config.title
  let loading = false

  const user = getCurrentUser()
  if (!user) {
    modalStore.close()
    modalStore.trigger({
      type: 'component',
      component: 'loginDialog',
      meta: { next: 'saveCloudDialog' }
    })
  }

  const save = async () => {
    if (loading) return
    loading = true
    try {
      if (!title) {
        throw new Error('Title is required')
      }
      if (!user) {
        throw new Error('User is not logged in')
      }
      const response = await createWheel({
        wheel: {
          config: { ...$wheelStore.config, title },
          entries: $wheelStore.entries
        },
        visibility: 'private',
        uid: user.uid
      })
      if (!response.success) {
        throw new Error('Failed to save wheel')
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

  // TODO: If the wheel has been saved previously, present the user with a
  // choice to overwrite the existing wheel or create a new wheel. This can be
  // done by writing the path to the wheel store when saving or opening a wheel
  // and checking if the path exists when opening the save cloud dialog. The
  // user should be shown as much metadata about the wheel as possible, such as
  // the title, number of entries, and date created. Additionally, there should
  // be a thumbnail of the wheel, the same one that would be shown in the open
  // cloud dialog.
</script>

{#if $modalStore[0]}
  <article class="card w-modal-slim p-4 shadow-xl overflow-hidden flex flex-col gap-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk" />
      <h1>Save a wheel</h1>
    </header>

    <form
      on:submit|preventDefault={save}
      class="flex flex-col gap-4"
    >
      <label class="label">
        <span class="required">Title</span>

        <input
          type="text"
          maxlength="50"
          required
          bind:value={title}
          placeholder="Enter a title for your wheel"
          class="input"
        />
      </label>

      <footer class="flex justify-end gap-2">
        <button
          type="button"
          class="btn variant-soft"
          on:click={modalStore.close}
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
