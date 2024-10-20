<script lang="ts">
  import {
    getModalStore, getToastStore, ProgressRadial
  } from '@skeletonlabs/skeleton'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { deleteWheel as apiDeleteWheel } from '$lib/utils/Api'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  const path: string = $modalStore[0].meta.path
  const title: string = $modalStore[0].meta.title

  let loading = $state(false)

  const deleteWheel = async () => {
    if (loading) return
    loading = true
    const user = getCurrentUser()
    try {
      if (!user) {
        throw new Error('User not logged in')
      }
      await apiDeleteWheel(path, user.uid)
      toastStore.trigger({ ...toastDefaults, message: 'Wheel deleted' })
    } catch (error) {
      if (error instanceof Error) {
        toastStore.trigger({
          ...toastDefaults,
          background: 'variant-filled-error',
          timeout: 5000,
          message: error.message
        })
      }
    } finally {
      loading = false
      modalStore.close()
    }
  }
</script>

{#if $modalStore[0]}
  <article class="card w-modal-slim p-4 shadow-xl overflow-hidden flex flex-col gap-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-trash"></i>
      <h1>Delete wheel</h1>
    </header>

    <section class="flex flex-col gap-2">
      <p>Are you sure you want to delete this wheel?</p>
      <div class="p-2 rounded flex gap-2 items-center bg-surface-50-900-token">
        <span class="text-xl">"{title}"</span>
        <span class="text-sm">({path})</span>
      </div>
      <p class="text-sm font-semibold text-error-700-200-token">
        This action cannot be undone.
      </p>
    </section>

    <footer class="flex justify-end gap-2">
      <button
        class="btn variant-filled"
        onclick={modalStore.close}
      >
        Cancel
      </button>
      <button
        class="btn variant-filled-error"
        onclick={deleteWheel}
      >
        {#if loading}
          <ProgressRadial width="w-6" />
        {:else}
          Delete
        {/if}
      </button>
  </article>
{/if}
