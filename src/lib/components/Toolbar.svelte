<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { popup, LightSwitch } from '@skeletonlabs/skeleton'
  import { fullscreenStore } from '$lib/stores/FullscreenStore'
  import MobileMenu from '$lib/components/MobileMenu.svelte'

  const dispatch = createEventDispatcher<{
    new: null,
    open: null,
    save: null
  }>()
</script>

<header
  class="px-4 py-2 bg-surface-200-700-token shadow-2xl flex justify-between items-center"
  role="toolbar"
>
  <a href="/">
    <h1 class="text-2xl">SvelteWheel</h1>
  </a>

  <div class="block lg:hidden">
    <button
      class="btn btn-icon-sm text-xl hover:variant-soft-primary"
      use:popup={{ event: 'click', target: 'mobileMenu' }}
      role="menu"
    >
      <i class="fas fa-bars" />
    </button>

    <div data-popup="mobileMenu">
      <MobileMenu
        on:new={() => dispatch('new')}
        on:open={() => dispatch('open')}
        on:save={() => dispatch('save')}
      />
    </div>
  </div>

  <div class="hidden lg:flex items-center">
    {#if !$fullscreenStore.active}
      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('new')}
        aria-label="New"
      >
        <i class="fas fa-file" />
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('open')}
        aria-label="Open"
      >
        <i class="fas fa-folder-open" />
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('save')}
        aria-label="Save"
      >
        <i class="fas fa-floppy-disk" />
      </button>
    {/if}

    {#if $fullscreenStore.supported}
      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => fullscreenStore.toggleFullscreen()}
        aria-label="Toggle fullscreen"
      >
        <i class="fas fa-{$fullscreenStore.active ? 'compress' : 'expand'}" />
      </button>
    {/if}

    <LightSwitch />
  </div>
</header>
