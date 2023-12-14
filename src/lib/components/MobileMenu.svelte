<script lang="ts">
  import { createEventDispatcher } from 'svelte'

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
</div>
