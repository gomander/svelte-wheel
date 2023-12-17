<script lang="ts">
	import '../app.postcss'
  import { onMount } from 'svelte'
	import {
    initializeStores, Modal, storePopup, type ModalComponent
  } from '@skeletonlabs/skeleton'
	import {
    computePosition, autoUpdate, flip, shift, offset, arrow
  } from '@floating-ui/dom'
  import { fullscreenStore } from '$lib/stores/FullscreenStore'
	import WinnerDialog from '$lib/components/WinnerDialog.svelte'
  import OpenDialog from '$lib/components/OpenDialog.svelte'
  import SaveDialog from '$lib/components/SaveDialog.svelte'
  import SaveLocalDialog from '$lib/components/SaveLocalDialog.svelte'

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
	initializeStores()

  const modalRegistry: Record<string, ModalComponent> = {
		winnerDialog: { ref: WinnerDialog },
    openDialog: { ref: OpenDialog },
    saveDialog: { ref: SaveDialog },
    saveLocalDialog: { ref: SaveLocalDialog }
	}

  onMount(fullscreenStore.initialize)
</script>

<svelte:head>
  <title>Svelte Wheel</title>
</svelte:head>

<Modal components={modalRegistry} />

<slot />
