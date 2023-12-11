<script lang="ts">
	import '../app.postcss'
	import {
    initializeStores, Modal, storePopup, type ModalComponent
  } from '@skeletonlabs/skeleton'
	import {
    computePosition, autoUpdate, flip, shift, offset, arrow
  } from '@floating-ui/dom'
	import WinnerDialog from '$lib/components/WinnerDialog.svelte'

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
	initializeStores()

  const modalRegistry: Record<string, ModalComponent> = {
		winnerDialog: { ref: WinnerDialog }
	}
</script>

<svelte:head>
  <title>Svelte Wheel</title>
</svelte:head>

<Modal components={modalRegistry} />

<slot />
