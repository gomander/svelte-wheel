<script lang="ts">
  import { Popover } from '@skeletonlabs/skeleton-svelte'
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

  let mobileMenuOpen = $state(false)
  let moreMenuOpen = $state(false)
</script>

<header class="relative px-4 py-2 preset-filled-surface-100-900 shadow-2xl flex justify-between items-center">
  <a href="/">
    <h1 class="text-2xl">SvelteWheel</h1>
  </a>

  <Popover
    open={mobileMenuOpen}
    onOpenChange={(e) => (mobileMenuOpen = e.open)}
    positioning={{ placement: 'bottom-end' }}
    triggerBase="block md:hidden btn-icon btn-icon-base hover:preset-tonal-primary"
    triggerAriaLabel="Toggle menu"
    contentBase="preset-filled-surface-50-950"
  >
    {#snippet trigger()}
      <i class="fas fa-bars"></i>
    {/snippet}
    {#snippet content()}
      <MobileMenu
        {onNew}
        {onOpen}
        {onSave}
        {onCustomize}
        {onShare}
        {onAccount}
        {onDebug}
      />
    {/snippet}
  </Popover>

  <div
    class="hidden md:flex items-center"
    role="menubar"
    aria-label="Toolbar"
  >
    {#if !fullscreenStore.active}
      <button
        class="btn max-lg:btn-icon hover:preset-tonal-primary"
        onclick={onNew}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="New"
        title="New"
      >
        <i class="fas fa-file"></i>
        <span class="hidden lg:inline">New</span>
      </button>

      <button
        class="btn max-lg:btn-icon hover:preset-tonal-primary"
        onclick={onOpen}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Open"
        title="Open"
      >
        <i class="fas fa-folder-open"></i>
        <span class="hidden lg:inline">Open</span>
      </button>

      <button
        class="btn max-lg:btn-icon hover:preset-tonal-primary"
        onclick={onSave}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Save"
        title="Save"
      >
        <i class="fas fa-floppy-disk"></i>
        <span class="hidden lg:inline">Save</span>
      </button>

      <button
        class="btn max-lg:btn-icon hover:preset-tonal-primary"
        onclick={onCustomize}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Customize"
        title="Customize"
      >
        <i class="fas fa-palette"></i>
        <span class="hidden lg:inline">Customize</span>
      </button>

      <button
        class="btn max-lg:btn-icon hover:preset-tonal-primary"
        onclick={onShare}
        disabled={busyStore.spinning}
        role="menuitem"
        aria-label="Share"
        title="Share"
      >
        <i class="fas fa-share-nodes"></i>
        <span class="hidden lg:inline">Share</span>
      </button>
    {/if}

    {#if fullscreenStore.supported}
      <button
        class="btn-icon btn-icon-base hover:preset-tonal-primary"
        onclick={() => fullscreenStore.toggleFullscreen()}
        role="menuitem"
        aria-label="Toggle fullscreen"
        title="Toggle fullscreen"
      >
        <i class="fas fa-{fullscreenStore.active ? 'compress' : 'expand'}"></i>
      </button>
    {/if}

    <Popover
      open={moreMenuOpen}
      onOpenChange={(e) => (moreMenuOpen = e.open)}
      positioning={{ placement: 'bottom-end' }}
      triggerBase="btn-icon btn-icon-base hover:preset-tonal-primary"
      triggerAriaLabel="Toggle more menu"
      contentBase="preset-filled-surface-50-950"
    >
      {#snippet trigger()}
        <i class="fas fa-bars"></i>
      {/snippet}
      {#snippet content()}
        <MoreMenu
          {onAccount}
          {onDebug}
        />
      {/snippet}
    </Popover>
  </div>
</header>
