<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import fullscreenStore from '$lib/stores/FullscreenStore.svelte'
  import busyStore from '$lib/stores/BusyStore.svelte'
  import MobileMenu from '$lib/components/MobileMenu.svelte'
  import MoreMenu from '$lib/components/MoreMenu.svelte'

  const dispatch = createEventDispatcher<{
    new: null,
    open: null,
    save: null,
    customize: null,
    share: null,
    account: null,
    debug: null
  }>()
</script>

<header class="px-4 py-2 bg-surface-200-800 shadow-2xl flex justify-between items-center">
  <a href="/">
    <h1 class="text-2xl">SvelteWheel</h1>
  </a>

  <div class="block lg:hidden">
    <button
      class="btn btn-icon-sm text-xl hover:preset-tonal-primary"
      aria-haspopup="menu"
      aria-controls="mobileMenu"
      aria-label="Toggle menu"
      title="Menu"
    >
      <!-- TODO: Open popup when clicked -->
      <i class="fas fa-bars"></i>
    </button>

    <div
      id="mobileMenu"
      role="menu"
      aria-label="Menu"
      class="z-50"
      data-popup="mobileMenu"
    >
      <MobileMenu
        on:new={() => dispatch('new')}
        on:open={() => dispatch('open')}
        on:save={() => dispatch('save')}
        on:customize={() => dispatch('customize')}
        on:share={() => dispatch('share')}
        on:account={() => dispatch('account')}
        on:debug={() => dispatch('debug')}
      />
    </div>
  </div>

  <div
    class="hidden lg:flex items-center"
    role="menubar"
    aria-label="Toolbar"
  >
    {#if !fullscreenStore.active}
      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={() => dispatch('new')}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="New"
        title="New"
      >
        <i class="fas fa-file"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={() => dispatch('open')}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Open"
        title="Open"
      >
        <i class="fas fa-folder-open"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={() => dispatch('save')}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Save"
        title="Save"
      >
        <i class="fas fa-floppy-disk"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={() => dispatch('customize')}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Customize"
        title="Customize"
      >
        <i class="fas fa-palette"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={() => dispatch('share')}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Share"
        title="Share"
      >
        <i class="fas fa-share-nodes"></i>
      </button>
    {/if}

    {#if fullscreenStore.supported}
      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={() => fullscreenStore.toggleFullscreen()}
        role="menuitem"
        aria-label="Toggle fullscreen"
        title="Toggle fullscreen"
      >
        <i class="fas fa-{fullscreenStore.active ? 'compress' : 'expand'}"></i>
      </button>
    {/if}

    <div>
      <button
        class="btn btn-icon-sm text-xl hover:preset-tonal-primary"
        role="menuitem"
        aria-haspopup="menu"
        aria-controls="moreMenu"
        aria-label="Toggle more menu"
        title="More"
      >
        <!-- TODO: Open popup when clicked -->
        <i class="fas fa-bars"></i>
      </button>

      <div
        id="moreMenu"
        role="menu"
        aria-label="More options"
        class="z-50"
        data-popup="moreMenu"
      >
        <MoreMenu
          on:account={() => dispatch('account')}
          on:debug={() => dispatch('debug')}
        />
      </div>
    </div>
  </div>
</header>
