<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { toastDefaults } from '$lib/utils/Toast'

  // TODO: Implement modal

  const toast: ToastContext = getContext('toast')

  const path = 'abc-123'
  const link = `${window.location.origin}/${path}`

  function copyLink() {
    navigator.clipboard.writeText(link)
    toast.create({
      ...toastDefaults,
      description: 'Link copied to clipboard'
    })
  }

  function close() {
    // modalStore.close()
  }
</script>

{#if false}
<article class="card p-4 w-modal-slim shadow-lg overflow-hidden flex flex-col gap-4">
  <header class="h3 flex items-center gap-2">
    <i class="fas fa-share-nodes"></i>
    <h1>Wheel shared</h1>
  </header>

  <section class="flex flex-col gap-2">
    <p>
      Your wheel has been shared. It can be viewed and spun by anyone using the
      link below.
    </p>
    <div class="flex justify-between items-center bg-surface-50-950 rounded-xl px-4 py-3">
      <a href="/{path}">{link}</a>
      <button
        class="btn-icon preset-filled-primary-500"
        aria-label="Copy link to clipboard"
        title="Copy link to clipboard"
        onclick={copyLink}
      >
        <i class="fas fa-clipboard"></i>
      </button>
    </div>
  </section>

  <footer class="flex justify-end gap-2">
    <button
      type="button"
      class="btn preset-tonal"
      onclick={close}
    >
      Close
    </button>
  </footer>
</article>
{/if}
