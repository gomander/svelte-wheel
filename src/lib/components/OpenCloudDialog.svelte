<script lang="ts">
  import { onMount } from 'svelte'
  import {
    ProgressRadial, getModalStore, getToastStore
  } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { getWheel, getWheels, type ApiWheelMeta } from '$lib/utils/Api'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let form: HTMLFormElement
  let loading = false
  let wheels: ApiWheelMeta[] = []

  onMount(async () => {
    const user = getCurrentUser()
    try {
      if (!user) {
        modalStore.trigger({
          type: 'component',
          component: 'loginDialog',
          meta: { next: 'openCloudDialog' }
        })
        throw new Error('User is not logged in')
      }
      const response = await getWheels(user.uid)
      if (!response.success) {
        throw new Error('Failed to fetch wheels')
      }
      wheels = response.data.wheels
    } catch (error) {
      if (error instanceof Error) {
        toastStore.trigger({
          ...toastDefaults,
          message: error.message,
          background: 'variant-filled-error'
        })
      }
      modalStore.close()
    }
  })

  const open = async () => {
    if (loading) return
    loading = true
    const formData = new FormData(form)
    const path = String(formData.get('wheel'))
    try {
      const response = await getWheel(path)
      if (!response.success) {
        throw new Error('Error opening wheel')
      }
      const { config, entries } = response.data.wheel
      wheelStore.setConfig(config)
      wheelStore.setEntries(entries)
      wheelStore.setWinners([])
      wheelStore.setPath(path)
      modalStore.close()
      toastStore.trigger({
        ...toastDefaults,
        message: 'Wheel opened',
        background: 'variant-filled-primary',
        timeout: 1000
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

  // TODO: Use tabs to separate private and public wheels. Display the wheels in
  // a paginated list. The wheels should be sorted by date modified. The user
  // should be able to search for a wheel by title. The user should be able to
  // delete a wheel by clicking on a delete button. Each wheel should have a
  // thumbnail, the title, the date modified, and the wheel ID/path. Other items
  // that may be displayed include the number of entries, the original save
  // date, and the beginning of the wheel's description.
</script>

{#if $modalStore[0]}
  <article class="card w-modal-slim p-4 shadow-xl overflow-hidden flex flex-col gap-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk" />
      <h1>Open a wheel</h1>
    </header>

    <form
      bind:this={form}
      on:submit|preventDefault={open}
      class="flex flex-col gap-4"
    >
      <label class="label">
        <span>Wheel</span>
        <select
          name="wheel"
          class="select"
        >
          {#each wheels as wheel}
            <option value={wheel.path}>
              {wheel.title}
            </option>
          {/each}
        </select>
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
          {#if loading}
            <ProgressRadial width="w-6" />
          {:else}
            Open
          {/if}
        </button>
      </footer>
    </form>
  </article>
{/if}
