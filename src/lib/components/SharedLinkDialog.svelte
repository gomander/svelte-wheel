<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open(wheelPath: string) {
    path = wheelPath
    dialog.open()
  }

  const toast: ToastContext = getContext('toast')

  let path = $state('')
  let link = $derived(`${window.location.origin}/${path}`)
  let dialog: AppDialog = $state(null!)

  function copyLink() {
    navigator.clipboard.writeText(link)
    toast.create({
      ...toastDefaults,
      description: 'Link copied to clipboard',
      type: 'success'
    })
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
  <article class="p-4 flex flex-col gap-4">
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
</AppDialog>
