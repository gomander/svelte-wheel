<script lang="ts">
  import { getContext } from 'svelte'
  import { Avatar, ProgressRing, Segment, type ToastContext } from '@skeletonlabs/skeleton-svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import { getCurrentUser } from '$lib/utils/Firebase'
  import { getWheel, getWheels, type ApiWheelMeta } from '$lib/utils/Api'
  import { getStringFromError } from '$lib/utils/General'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open() {
    loading = true
    const user = getCurrentUser()
    if (!user) {
      onNotLoggedIn()
      return
    }
    getWheels(user.uid).then((response) => {
      if (!response.success) {
        throw new Error(response.error.message)
      }
      apiWheels = response.data.wheels
      if (!apiWheels.length) {
        throw new Error('No saved wheels')
      }
    }).catch((error) => {
      toast.create({
        ...toastDefaults,
        description: getStringFromError(error),
        type: 'error'
      })
      close()
    }).finally(() => {
      loading = false
    })
    dialog.open()
  }

  let { onDelete, onNotLoggedIn }: {
    onDelete: (path: string, title: string) => void
    onNotLoggedIn: () => void
  } = $props()

  const toast: ToastContext = getContext('toast')

  let dialog: AppDialog = $state(null!)
  let innerHeight = $state(0)
  let form: HTMLFormElement = $state(null!)
  let loading = $state(false)
  let apiWheels: ApiWheelMeta[] = $state([])
  let selectedWheel: string = $state('')
  let filter = $state('')
  let sort: 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc' = $state('updated-desc')
  let page = $state(0)

  const wheelImages: Record<string, string> = $state({})

  function deleteWheel(path: string) {
    close()
    onDelete(path, apiWheels.find(wheel => wheel.path === path)!.title)
  }

  async function openWheel(e: Event) {
    e.preventDefault()
    if (!selectedWheel) return
    if (loading) return
    loading = true
    try {
      const user = getCurrentUser()
      if (!user) throw new Error('User is not logged in')
      const response = await getWheel(selectedWheel, user.uid)
      if (!response.success) throw new Error(response.error.message)
      const { config, entries } = response.data.wheel
      wheelStore.config = config
      wheelStore.setNewEntries(entries)
      wheelStore.winners = []
      wheelStore.path = selectedWheel
      close()
      toast.create({
        ...toastDefaults,
        description: 'Wheel opened',
        duration: 1000
      })
    } catch (error) {
      toast.create({
        ...toastDefaults,
        description: getStringFromError(error),
        type: 'error'
      })
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
        pageWheels.map(async (wheel) => {
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

  function close() {
    dialog.close()
  }
</script>

<svelte:window bind:innerHeight />

<AppDialog bind:this={dialog}>
  <article class="p-4 flex flex-col gap-4">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-floppy-disk"></i>
      <h1>Open a wheel</h1>
    </header>

    <form
      bind:this={form}
      onsubmit={openWheel}
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

        <!-- TODO: Fix list being in a row rather than a column -->
        <Segment
          rounded="rounded-container"
          flexDirection="flex-col"
          padding="p-1"
          value={selectedWheel}
          onValueChange={(e) => (selectedWheel = e.value!)}
        >
          {#each pageWheels as wheel, i (wheel.path)}
            {#if i !== 0}
              <hr>
            {/if}
            <Segment.Item value={wheel.path}>
              <div class="flex items-center gap-2">
                <Avatar
                  name="?"
                  src={wheelImages[wheel.path]}
                  size="w-14"
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
                  >
                    <!-- TODO: Open popup when clicked -->
                    <i class="fas fa-ellipsis-v"></i>
                  </button>

                  <div class="card p-2 rounded-xl" data-popup="popup({wheel.path})">
                    <div class=" flex flex-col gap-2">
                      <button
                        type="button"
                        class="btn btn-sm preset-filled-error-500 flex items-center gap-2"
                        onclick={() => deleteWheel(wheel.path)}
                      >
                        <i class="fas fa-trash"></i> Delete wheel
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm preset-filled-warning-500 flex items-center gap-2"
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
            </Segment.Item>
          {/each}
          {#if !pageWheels.length}
            <div class="flex justify-center items-center min-h-14">
              No wheels found
            </div>
          {:else if filteredWheels.length > wheelsPerPage}
            <div style="height: {4 * (wheelsPerPage - pageWheels.length)}rem"></div>
          {/if}
        </Segment>
      {:else if loading}
        <div class="flex justify-center">
          <ProgressRing size="w-12" />
        </div>
      {:else}
        <p class="text-center">No wheels found</p>
      {/if}

      {#if apiWheels.length > wheelsPerPage}
        <div class="flex justify-evenly items-center">
          <button
            type="button"
            class="btn preset-tonal"
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
            class="btn preset-tonal"
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
          class="btn preset-tonal"
          onclick={close}
        >
          Cancel
        </button>
        <button
          class="btn preset-filled-primary-500"
          disabled={!selectedWheel}
        >
          {#if loading}
            <ProgressRing size="w-6" />
          {:else}
            Open
          {/if}
        </button>
      </footer>
    </form>
  </article>
</AppDialog>
