<script lang="ts">
  import { getModalStore, clipboard } from '@skeletonlabs/skeleton'

  const modalStore = getModalStore()

  const path = $modalStore[0].meta.path as string
  const link = `${window.location.origin}/${path}`
</script>

{#if $modalStore[0]}
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
    <div class="flex justify-between items-center bg-surface-50-900-token rounded-xl px-4 py-3">
      <a href="/{path}">{link}</a>
      <button
        class="btn-icon variant-filled-primary"
        use:clipboard={link}
        aria-label="Copy link to clipboard"
        title="Copy link to clipboard"
      >
        <i class="fas fa-clipboard"></i>
      </button>
    </div>
  </section>

  <footer class="flex justify-end gap-2">
    <button
      type="button"
      class="btn variant-soft"
      onclick={modalStore.close}
    >
      Close
    </button>
  </footer>
</article>
{/if}
