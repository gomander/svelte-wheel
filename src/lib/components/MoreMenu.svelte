<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import busyStore from '$lib/stores/BusyStore.svelte'
  import debugStore from '$lib/stores/DebugStore.svelte'

  const dispatch = createEventDispatcher<{
    account: null,
    debug: null
  }>()
</script>

<div class="card flex flex-col w-fit shadow-xl p-2">
  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('account')}
    disabled={busyStore.spinning}
  >
    <i class="fas fa-user w-6"></i>
    <span class="grow text-left">Account</span>
  </button>

  <a
    href="/faq"
    class="btn text-xl hover:preset-tonal-primary"
  >
    <i class="fas fa-question w-6"></i>
    <span class="grow text-left">FAQ</span>
  </a>

  <!-- TODO: Implement theme option -->

  <a
    href="https://github.com/gomander/svelte-wheel"
    target="_blank"
    class="btn text-xl hover:preset-tonal-primary"
  >
    <i class="fas fa-code w-6"></i>
    <span class="grow text-left">GitHub</span>
  </a>

  <button
    class="btn text-xl hover:preset-tonal-primary"
    onclick={() => dispatch('debug')}
    disabled={busyStore.spinning}
  >
    <i class="fas {debugStore.active ? 'fa-bug-slash' : 'fa-bug'} w-6"></i>
    <span class="grow text-left">Debug</span>
  </button>
</div>
