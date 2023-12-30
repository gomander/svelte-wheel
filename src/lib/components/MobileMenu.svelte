<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { LightSwitch } from '@skeletonlabs/skeleton'
  import busyStore from '$lib/stores/BusyStore'

  const dispatch = createEventDispatcher<{
    new: null,
    open: null,
    customize: null,
    account: null,
    save: null
  }>()
</script>

<div class="card flex flex-col w-fit shadow-xl p-2">
  <button
    class="btn text-xl hover:variant-soft-primary"
    on:click={() => dispatch('new')}
    disabled={$busyStore.spinning}
  >
    <i class="fas fa-file w-6" />
    <span class="flex-grow text-left">New</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    on:click={() => dispatch('open')}
    disabled={$busyStore.spinning}
  >
    <i class="fas fa-folder-open w-6" />
    <span class="flex-grow text-left">Open</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    on:click={() => dispatch('save')}
    disabled={$busyStore.spinning}
  >
    <i class="fas fa-floppy-disk w-6" />
    <span class="flex-grow text-left">Save</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    on:click={() => dispatch('customize')}
    disabled={$busyStore.spinning}
  >
    <i class="fas fa-palette w-6" />
    <span class="flex-grow text-left">Customize</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    on:click={() => dispatch('account')}
    disabled={$busyStore.spinning}
  >
    <i class="fas fa-user w-6" />
    <span class="flex-grow text-left">Account</span>
  </button>

  <a
    href="/faq"
    class="btn text-xl hover:variant-soft-primary"
  >
    <i class="fas fa-question w-6" />
    <span class="flex-grow text-left">FAQ</span>
  </a>

  <div class="btn text-xl">
    <LightSwitch />
    <span class="flex-grow text-left">Theme</span>
  </div>
</div>
