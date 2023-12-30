<script lang="ts">
  import { onMount } from 'svelte'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import type { ApiWheel } from '$lib/types/api'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  const user = getCurrentUser()
  if (!user) {
    modalStore.close()
    modalStore.trigger({
      type: 'component',
      component: 'loginDialog',
      meta: { next: 'openCloudDialog' }
    })
  }

  let form: HTMLFormElement
  let wheels: ApiWheel[] = []

  onMount(async () => {
    const res = await fetch('/api/wheels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getCurrentUser()?.uid || ''
      }
    })
    const responseObject = await res.json() as { data: { wheels: ApiWheel[] } }
    wheels = responseObject.data.wheels
  })

  const open = async () => {
    const formData = new FormData(form)
    const path = String(formData.get('wheel'))
    const wheel = wheels.find(wheel => wheel.path === path)
    if (!wheel) return
    wheelStore.setConfig(wheel.config)
    wheelStore.setEntries(wheel.entries)
    modalStore.close()
    toastStore.trigger({
      message: 'Wheel opened successfully!',
      background: 'variant-soft-primary',
      timeout: 3000,
      hideDismiss: true
    })
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
              Wheel: {wheel.config.title}
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
          Open
        </button>
      </footer>
    </form>
  </article>
{/if}
