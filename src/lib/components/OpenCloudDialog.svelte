<script lang="ts">
  import { onMount } from 'svelte'
  import {
    Avatar, ProgressRadial, RadioGroup, RadioItem, getModalStore, getToastStore,
    popup
  } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { getWheel, getWheels, type ApiWheelMeta } from '$lib/utils/Api'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let innerHeight = $state(0)

  let form: HTMLFormElement = $state(null!)
  let loading = $state(false)
  let apiWheels: ApiWheelMeta[] = $state([])
  let selectedWheel: string = $state('')
  let filter = $state('')
  let sort: 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc' = $state('updated-desc')
  let page = $state(0)


  const wheelImages: Record<string, string> = $state({})

  const settingsPopup = { event: 'click', placement: 'left' } as const

  const deleteWheel = (path: string) => {
    modalStore.close()
    modalStore.trigger({
      type: 'component',
      component: 'deleteWheelDialog',
      meta: { path, title: apiWheels.find(wheel => wheel.path === path)?.title }
    })
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

  const open = async (e: Event) => {
    e.preventDefault()
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
      wheelStore.config = config
      wheelStore.setNewEntries(entries)
      wheelStore.winners =[]
      wheelStore.path = path
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

  // TODO: Use tabs to separate private and public wheels. Allow users to change
  // a wheel's visibility.
  let wheelsPerPage = $derived(Math.floor(innerHeight / 200))
  let sortedWheels = $derived(apiWheels.toSorted((a, b) => {
    switch (sort) {
      case 'updated-desc':
        return (b.updated || b.created) - (a.updated || a.created)
      case 'updated-asc':
        return (a.updated || a.created) - (b.updated || b.created)
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  }))
  let filteredWheels = $derived(sortedWheels.filter(
    wheel => wheel.title.toLowerCase().includes(filter.toLowerCase())
  ))
  $effect(() => {
    while (
      page && page > Math.ceil(filteredWheels.length / wheelsPerPage) - 1
    ) {
      page--
    }
  })
  let pageWheels = $derived(filteredWheels.slice(
    page * wheelsPerPage, page * wheelsPerPage + wheelsPerPage
  ))
  $effect(() => {
    if (pageWheels.length) {
      Promise.all(
        pageWheels.map(async wheel => {
          if (wheel.path in wheelImages) return true
          wheelImages[wheel.path] = ''
          const response = await fetch(
            `${window.location.origin}/thumbnails/${wheel.path}?size=56`,
            { headers: { authorization: getCurrentUser()?.uid || '' } }
          )
          if (response.ok) {
            const buffer = await response.arrayBuffer()
            wheelImages[wheel.path] = URL.createObjectURL(
              new Blob([buffer], { type: 'image/webp' })
            )
            return true
          }
          return false
        })
      )
    }
  })
</script>

<svelte:window bind:innerHeight />

{#if $modalStore[0]}
  <article class="card w-modal p-4 shadow-xl overflow-hidden flex flex-col gap-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk"></i>
      <h1>Open a wheel</h1>
    </header>

    <form
      bind:this={form}
      onsubmit={open}
      class="flex flex-col gap-2"
    >
      {#if apiWheels.length}
        {#if apiWheels.length > wheelsPerPage}
          <label class="input-group grid-cols-[auto_1fr]">
            <div><i class="fas fa-search"></i></div>
            <input
              type="search"
              class="input"
              placeholder="Search..."
              bind:value={filter}
              aria-label="Search"
            >
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
          padding="p-1"
        >
          {#each pageWheels as wheel, i (wheel.path)}
            {#if i !== 0}
              <hr>
            {/if}
            <RadioItem
              bind:group={selectedWheel}
              name="wheel"
              value={wheel.path}
            >
              <div class="flex items-center gap-2">
                <Avatar
                  src={wheelImages[wheel.path]}
                  width="w-14"
                  initials="?"
                />
                <div class="min-h-14 flex-1 flex flex-col justify-center">
                  <div class="flex gap-2 justify-center items-center">
                    <span class="text-lg font-semibold">{wheel.title}</span>
                    {#if wheel.visibility === 'private'}
                      <i class="fas fa-lock text-xs" title="Private"></i>
                    {/if}
                  </div>
                  {#if wheel.visibility === 'public'}
                    <div class="text-sm mt-1 flex gap-2 justify-center items-center">
                      <i class="fas fa-globe" title="Public"></i>
                      <span>{wheel.path}</span>
                    </div>
                  {/if}
                </div>
                <div>
                  <button
                    type="button"
                    class="btn-icon btn-icon-sm"
                    aria-label="Settings"
                    use:popup={{ ...settingsPopup, target: `popup(${wheel.path})` }}
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>

                  <div class="card p-2 rounded-xl" data-popup="popup({wheel.path})">
                    <div class=" flex flex-col gap-2">
                      <button
                        type="button"
                        class="btn btn-sm variant-filled-error flex items-center gap-2"
                        onclick={() => deleteWheel(wheel.path)}
                      >
                        <i class="fas fa-trash"></i> Delete wheel
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm variant-filled-warning flex items-center gap-2"
                      >
                        {#if wheel.visibility === 'private'}
                          <i class="fas fa-lock-open"></i> Make public
                        {:else}
                          <i class="fas fa-lock"></i> Make private
                        {/if}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </RadioItem>
          {/each}
          {#if !pageWheels.length}
            <div class="flex justify-center items-center min-h-14">
              No wheels found
            </div>
          {:else if filteredWheels.length > wheelsPerPage}
            <div style="height: {4 * (wheelsPerPage - pageWheels.length)}rem"></div>
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
            onclick={() => page--}
            aria-label="Previous page"
            title="Previous page"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="text-center">
            {page + 1} / {Math.ceil(filteredWheels.length / wheelsPerPage) || 1}
          </span>
          <button
            type="button"
            class="btn variant-soft"
            disabled={page >= Math.ceil(filteredWheels.length / wheelsPerPage) - 1}
            onclick={() => page++}
            aria-label="Next page"
            title="Next page"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      {/if}

      <footer class="flex justify-end gap-2">
        <button
          type="button"
          class="btn variant-soft"
          onclick={modalStore.close}
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
