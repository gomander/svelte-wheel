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
      meta: { next: 'shareDialog' }
    })
  }

  const share = async () => {
    if (loading) return
    if (!title) {
      toastStore.trigger({
        ...toastDefaults,
        message: 'Please enter a title for your wheel',
        background: 'variant-filled-error'
      })
      return
    }
    if (!user) {
      toastStore.trigger({
        ...toastDefaults,
        message: 'You must be logged in to share a wheel',
        background: 'variant-filled-error'
      })
      return
    }
    loading = true
    try {
      const response = await createWheel({
        wheel: {
          config: { ...$wheelStore.config, title },
          entries: $wheelStore.entries
        },
        visibility: 'public',
        uid: user.uid
      })
      if (!response.success) {
        throw new Error('Failed to share wheel')
      }
      modalStore.close()
      toastStore.trigger({
        ...toastDefaults,
        message: `Wheel shared successfully! You can view it at https://sveltewheel.com/${response.data.path}`,
        background: 'variant-filled-primary',
        timeout: 7000
      })
    } catch (error) {
      toastStore.trigger({
        ...toastDefaults,
        message: 'There was an error sharing your wheel',
        background: 'variant-filled-error'
      })
    } finally {
      loading = false
    }
  }
</script>

{#if $modalStore[0]}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-share-nodes" />
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
      on:submit|preventDefault={share}
      class="flex flex-col gap-4"
    >
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
