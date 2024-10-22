<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { LightSwitch } from '@skeletonlabs/skeleton'
  import busyStore from '$lib/stores/BusyStore'
  import debugStore from '$lib/stores/DebugStore.svelte'

  const dispatch = createEventDispatcher<{
    new: null,
    open: null,
    customize: null,
    share: null,
    account: null,
    save: null,
    debug: null
  }>()
</script>

<div class="card flex flex-col w-fit shadow-xl p-2">
  <button
    class="btn text-xl hover:variant-soft-primary"
    onclick={() => dispatch('new')}
    disabled={$busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-file w-6"></i>
    <span class="flex-grow text-left">New</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    onclick={() => dispatch('open')}
    disabled={$busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-folder-open w-6"></i>
    <span class="flex-grow text-left">Open</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    onclick={() => dispatch('save')}
    disabled={$busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-floppy-disk w-6"></i>
    <span class="flex-grow text-left">Save</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    onclick={() => dispatch('customize')}
    disabled={$busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-palette w-6"></i>
    <span class="flex-grow text-left">Customize</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    onclick={() => dispatch('share')}
    disabled={$busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-share-nodes w-6"></i>
    <span class="flex-grow text-left">Share</span>
  </button>

  <button
    class="btn text-xl hover:variant-soft-primary"
    onclick={() => dispatch('account')}
    disabled={$busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-user w-6"></i>
    <span class="flex-grow text-left">Account</span>
  </button>

  <a
    href="/faq"
    class="btn text-xl hover:variant-soft-primary"
    role="menuitem"
  >
    <i class="fas fa-question w-6"></i>
    <span class="flex-grow text-left">FAQ</span>
  </a>

  <div class="btn text-xl">
    <LightSwitch />
    <span class="flex-grow text-left">Theme</span>
  </div>

  <a
    href="https://github.com/gomander/svelte-wheel"
    target="_blank"
    class="btn text-xl hover:variant-soft-primary"
    role="menuitem"
  >
    <i class="fas fa-code w-6"></i>
    <span class="flex-grow text-left">GitHub</span>
  </a>

  <button
    class="btn text-xl hover:variant-soft-primary"
    onclick={() => dispatch('debug')}
    disabled={$busyStore.spinning}
    role="menuitem"
  >
    <i class="fas {debugStore.active ? 'fa-bug-slash' : 'fa-bug'} w-6"></i>
    <span class="flex-grow text-left">Debug</span>
  </button>
</div>
