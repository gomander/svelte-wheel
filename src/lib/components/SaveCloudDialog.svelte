<script lang="ts">
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { wheelStore } from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let title = $wheelStore.config.title

  const save = async () => {
    if (!title) return

    const res = await fetch('/api/wheels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wheel: {
          config: $wheelStore.config,
          entries: $wheelStore.entries
        },
        visibility: 'private',
        uid: getCurrentUser()?.uid
      })
    })

    const responseObject = await res.json()

    console.log(responseObject)

    toastStore.trigger({
      message: 'Wheel saved successfully!',
      background: 'variant-soft-primary',
      timeout: 3000,
      hideDismiss: true
    })
  }
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
        <span>Title</span>

        <input
          type="text"
          maxlength="50"
          required
          bind:value={title}
          placeholder="Untitled"
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

        <button class="btn variant-filled-primary">
          Save
        </button>
      </footer>
    </form>
  </article>
{/if}
