<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { popup } from '@skeletonlabs/skeleton'
  import fullscreenStore from '$lib/stores/FullscreenStore'
  import busyStore from '$lib/stores/BusyStore'
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

<header
  class="px-4 py-2 bg-surface-200-700-token shadow-2xl flex justify-between items-center"
  role="menubar"
  aria-label="Toolbar"
>
  <a href="/">
    <h1 class="text-2xl">SvelteWheel</h1>
  </a>

  <div class="block lg:hidden">
    <button
      class="btn btn-icon-sm text-xl hover:variant-soft-primary"
      use:popup={{ event: 'click', target: 'mobileMenu' }}
      role="menuitem"
      aria-haspopup="menu"
      aria-controls="mobileMenu"
      aria-label="Toggle menu"
      title="Menu"
    >
      <i class="fas fa-bars" />
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

  <div class="hidden lg:flex items-center">
    {#if !$fullscreenStore.active}
      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('new')}
        disabled={$busyStore.spinning}
        role="menuitem"
        aria-label="New"
        title="New"
      >
        <i class="fas fa-file" />
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('open')}
        disabled={$busyStore.spinning}
        role="menuitem"
        aria-label="Open"
        title="Open"
      >
        <i class="fas fa-folder-open" />
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('save')}
        disabled={$busyStore.spinning}
        role="menuitem"
        aria-label="Save"
        title="Save"
      >
        <i class="fas fa-floppy-disk" />
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('customize')}
        disabled={$busyStore.spinning}
        role="menuitem"
        aria-label="Customize"
        title="Customize"
      >
        <i class="fas fa-palette" />
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => dispatch('share')}
        disabled={$busyStore.spinning}
        role="menuitem"
        aria-label="Share"
        title="Share"
      >
        <i class="fas fa-share-nodes" />
      </button>
    {/if}

    {#if $fullscreenStore.supported}
      <button
        class="btn btn-icon-sm text-lg hover:variant-soft-primary"
        on:click={() => fullscreenStore.toggleFullscreen()}
        role="menuitem"
        aria-label="Toggle fullscreen"
        title="Toggle fullscreen"
      >
        <i class="fas fa-{$fullscreenStore.active ? 'compress' : 'expand'}" />
      </button>
    {/if}

    <div>
      <button
        class="btn btn-icon-sm text-xl hover:variant-soft-primary"
        use:popup={{ event: 'click', target: 'moreMenu' }}
        role="menuitem"
        aria-haspopup="menu"
        aria-controls="moreMenu"
        aria-label="Toggle more menu"
        title="More"
      >
        <i class="fas fa-bars" />
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
