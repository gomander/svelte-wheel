<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { LightSwitch } from '@skeletonlabs/skeleton'

  const dispatch = createEventDispatcher<{ new: null }>()
</script>

<div class="card flex flex-col w-fit shadow-xl p-2">
  <button
    class="btn text-xl hover:variant-soft-primary"
    on:click={() => dispatch('new')}
  >
    <i class="fas fa-file w-6" />
    <span class="flex-grow text-left">New</span>
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