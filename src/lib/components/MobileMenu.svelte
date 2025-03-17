<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import busyStore from '$lib/stores/BusyStore.svelte'
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
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('new')}
    disabled={busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-file w-6"></i>
    <span class="grow text-left">New</span>
  </button>

  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('open')}
    disabled={busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-folder-open w-6"></i>
    <span class="grow text-left">Open</span>
  </button>

  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('save')}
    disabled={busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-floppy-disk w-6"></i>
    <span class="grow text-left">Save</span>
  </button>

  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('customize')}
    disabled={busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-palette w-6"></i>
    <span class="grow text-left">Customize</span>
  </button>

  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('share')}
    disabled={busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-share-nodes w-6"></i>
    <span class="grow text-left">Share</span>
  </button>

  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('account')}
    disabled={busyStore.spinning}
    role="menuitem"
  >
    <i class="fas fa-user w-6"></i>
    <span class="grow text-left">Account</span>
  </button>

  <a
    href="/faq"
    class="btn text-xl hover:preset-tonal-primary"
    role="menuitem"
  >
    <i class="fas fa-question w-6"></i>
    <span class="grow text-left">FAQ</span>
  </a>

  <!-- TODO: Implement theme option -->

  <a
    href="https://github.com/gomander/svelte-wheel"
    target="_blank"
    class="btn text-xl hover:preset-tonal-primary"
    role="menuitem"
  >
    <i class="fas fa-code w-6"></i>
    <span class="grow text-left">GitHub</span>
  </a>

  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('debug')}
    disabled={busyStore.spinning}
    role="menuitem"
  >
    <i class="fas {debugStore.active ? 'fa-bug-slash' : 'fa-bug'} w-6"></i>
    <span class="grow text-left">Debug</span>
  </button>
</div>
