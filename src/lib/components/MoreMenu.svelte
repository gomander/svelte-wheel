<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { LightSwitch } from '@skeletonlabs/skeleton'
  import busyStore from '$lib/stores/BusyStore'
  import debugStore from '$lib/stores/DebugStore'

  const dispatch = createEventDispatcher<{
    account: null,
    debug: null
  }>()
</script>

<div class="card flex flex-col w-fit shadow-xl p-2">
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

  <a
    href="https://github.com/gomander/svelte-wheel"
    target="_blank"
    class="btn text-xl hover:variant-soft-primary"
  >
    <i class="fab fa-github w-6" />
    <span class="flex-grow text-left">GitHub</span>
  </a>

  <button
    class="btn text-xl hover:variant-soft-primary"
    on:click={() => dispatch('debug')}
    disabled={$busyStore.spinning}
  >
    <i class="fas {$debugStore.active ? 'fa-bug-slash' : 'fa-bug'} w-6" />
    <span class="flex-grow text-left">Debug</span>
  </button>
</div>
