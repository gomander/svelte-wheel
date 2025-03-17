<script lang="ts">
  import fullscreenStore from '$lib/stores/FullscreenStore.svelte'
  import busyStore from '$lib/stores/BusyStore.svelte'
  import MobileMenu from '$lib/components/MobileMenu.svelte'
  import MoreMenu from '$lib/components/MoreMenu.svelte'

  let { onNew, onOpen, onSave, onCustomize, onShare, onAccount, onDebug }: {
    onNew: () => void
    onOpen: () => void
    onSave: () => void
    onCustomize: () => void
    onShare: () => void
    onAccount: () => void
    onDebug: () => void
  } = $props()
</script>

<header class="px-4 py-2 preset-filled-surface-100-900 shadow-2xl flex justify-between items-center">
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
        {onNew}
        {onOpen}
        {onSave}
        {onCustomize}
        {onShare}
        {onAccount}
        {onDebug}
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
        onclick={onNew}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="New"
        title="New"
      >
        <i class="fas fa-file"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={onOpen}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Open"
        title="Open"
      >
        <i class="fas fa-folder-open"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={onSave}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Save"
        title="Save"
      >
        <i class="fas fa-floppy-disk"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={onCustomize}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Customize"
        title="Customize"
      >
        <i class="fas fa-palette"></i>
      </button>

      <button
        class="btn btn-icon-sm text-lg hover:preset-tonal-primary"
        onclick={onShare}
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
          {onAccount}
          {onDebug}
        />
      </div>
    </div>
  </div>
</header>
