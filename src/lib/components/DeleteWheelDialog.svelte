<script lang="ts">
  import { getContext } from 'svelte'
  import { ProgressRing, type ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { deleteWheel as apiDeleteWheel } from '$lib/utils/Api'
  import { getStringFromError } from '$lib/utils/General'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open(wheelPath: string, wheelTitle: string) {
    path = wheelPath
    title = wheelTitle
    dialog.open()
  }

  const toast: ToastContext = getContext('toast')

  let dialog: AppDialog = $state(null!)
  let path = $state('')
  let title = $state('')
  let loading = $state(false)

  async function deleteWheel() {
    if (loading) return
    loading = true
    const user = getCurrentUser()
    try {
      if (!user) throw new Error('User not logged in')
      await apiDeleteWheel(path, user.uid)
      toast.create({ ...toastDefaults, description: 'Wheel deleted' })
    } catch (error) {
      toast.create({
        ...toastDefaults,
        duration: 5000,
        description: getStringFromError(error),
        type: 'error'
      })
    } finally {
      loading = false
      close()
    }
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
  <article class="card w-modal-slim p-4 shadow-xl overflow-hidden flex flex-col gap-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-trash"></i>
      <h1>Delete wheel</h1>
    </header>

    <section class="flex flex-col gap-2">
      <p>Are you sure you want to delete this wheel?</p>
      <div class="p-2 rounded-sm flex gap-2 items-center bg-surface-50-950">
        <span class="text-xl">"{title}"</span>
        <span class="text-sm">({path})</span>
      </div>
      <p class="text-sm font-semibold text-error-800-200">
        This action cannot be undone.
      </p>
    </section>

    <footer class="flex justify-end gap-2">
      <button
        class="btn preset-filled"
        onclick={close}
      >
        Cancel
      </button>
      <button
        class="btn preset-filled-error-500"
        onclick={deleteWheel}
      >
        {#if loading}
          <ProgressRing size="w-6" />
        {:else}
          Delete
        {/if}
      </button>
  </article>
</AppDialog>
