<script lang="ts">
  import { onMount } from 'svelte'
  import {
    ProgressRadial, RadioGroup, RadioItem, getModalStore, getToastStore
  } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { getWheel, getWheels, type ApiWheelMeta } from '$lib/utils/Api'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let innerHeight = 0
  $: wheelsPerPage = Math.floor(innerHeight / 200)

  let form: HTMLFormElement
  let loading = false
  let apiWheels: ApiWheelMeta[] = []
  $: sortedWheels = apiWheels.sort((a, b) => {
    switch (sort) {
      case 'updated-desc':
        return Number(b.updated || b.created) - Number(a.updated || a.created)
      case 'updated-asc':
        return Number(a.updated || a.created) - Number(b.updated || b.created)
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })
  $: filteredWheels = sortedWheels.filter(
    wheel => wheel.title.toLowerCase().includes(filter.toLowerCase())
  )
  $: pageWheels = filteredWheels.slice(
    page * wheelsPerPage, page * wheelsPerPage + wheelsPerPage
  )
  let selectedWheel: string
  let filter = ''
  let sort: 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc' = 'updated-desc'
  let page = 0

  $: while (
    page && page > Math.ceil(filteredWheels.length / wheelsPerPage) - 1
  ) {
    page--
  }

  onMount(async () => {
    loading = true
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
        throw new Error(response.error.message)
      }
      apiWheels = response.data.wheels
      if (!apiWheels.length) {
        throw new Error('No saved wheels')
      }
    } catch (error) {
      if (error instanceof Error) {
        toastStore.trigger({
          ...toastDefaults,
          message: error.message,
          background: 'variant-filled-error'
        })
      }
      modalStore.close()
    } finally {
      loading = false
    }
  })

  const open = async () => {
    if (!selectedWheel) return
    if (loading) return
    loading = true
    const formData = new FormData(form)
    const path = String(formData.get('wheel'))
    try {
      const user = getCurrentUser()
      if (!user) {
        throw new Error('User is not logged in')
      }
      const response = await getWheel(path, user.uid)
      if (!response.success) {
        throw new Error(response.error.message)
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

  // TODO: Use tabs to separate private and public wheels. The user should be
  // able to delete a wheel by clicking on a delete button.
</script>

<svelte:window bind:innerHeight />

{#if $modalStore[0]}
  <article class="card w-modal-slim p-4 shadow-xl overflow-hidden flex flex-col gap-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk" />
      <h1>Open a wheel</h1>
    </header>

    <form
      bind:this={form}
      on:submit|preventDefault={open}
      class="flex flex-col gap-2"
    >
      {#if apiWheels.length}
        {#if apiWheels.length > wheelsPerPage}
          <label class="input-group grid-cols-[auto_1fr]">
            <div><i class="fas fa-search" /></div>
            <input
              type="search"
              class="input"
              placeholder="Search..."
              bind:value={filter}
              aria-label="Search"
            />
          </label>
          <select
            class="select"
            bind:value={sort}
            aria-label="Sort"
            title="Sort"
          >
            <option value="updated-desc">Save date (newest first)</option>
            <option value="updated-asc">Save date (oldest first)</option>
            <option value="title-asc">Alphabetical (ascending)</option>
            <option value="title-desc">Alphabetical (descending)</option>
          </select>
        {/if}

        <RadioGroup
          rounded="rounded-container-token"
          flexDirection="flex-col"
          padding="px-1 pt-0 pb-1"
        >
          {#each pageWheels as wheel, i}
            {#if i !== 0}
              <hr />
            {/if}
            <RadioItem
              bind:group={selectedWheel}
              name="wheel"
              value={wheel.path}
            >
              <div class="min-h-12 flex flex-col justify-center">
                <div class="flex gap-2 justify-center items-center">
                  <span class="text-lg font-semibold">{wheel.title}</span>
                  {#if wheel.visibility === 'private'}
                    <i class="fas fa-lock text-xs" title="Private" />
                  {/if}
                </div>
                {#if wheel.visibility === 'public'}
                  <div class="text-sm mt-1 flex gap-2 justify-center items-center">
                    <i class="fas fa-globe" title="Public" />
                    <span>{wheel.path}</span>
                  </div>
                {/if}
              </div>
            </RadioItem>
          {/each}
          {#if !pageWheels.length}
            <div class="flex justify-center items-center min-h-14">
              No wheels found
            </div>
          {/if}
        </RadioGroup>
      {:else if loading}
        <div class="flex justify-center">
          <ProgressRadial width="w-12" />
        </div>
      {:else}
        <p class="text-center">No wheels found</p>
      {/if}

      {#if apiWheels.length > wheelsPerPage}
        <div class="flex justify-evenly items-center">
          <button
            type="button"
            class="btn variant-soft"
            disabled={page === 0}
            on:click={() => page--}
            aria-label="Previous page"
            title="Previous page"
          >
            <i class="fas fa-chevron-left" />
          </button>
          <span class="text-center">
            {page + 1} / {Math.ceil(filteredWheels.length / wheelsPerPage) || 1}
          </span>
          <button
            type="button"
            class="btn variant-soft"
            disabled={page >= Math.ceil(filteredWheels.length / wheelsPerPage) - 1}
            on:click={() => page++}
            aria-label="Next page"
            title="Next page"
          >
            <i class="fas fa-chevron-right" />
          </button>
        </div>
      {/if}

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
          disabled={!selectedWheel}
        >
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
