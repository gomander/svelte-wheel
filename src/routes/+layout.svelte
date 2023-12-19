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
  import LoginDialog from '$lib/components/LoginDialog.svelte'
  import SignUpDialog from '$lib/components/SignUpDialog.svelte'
  // import ResetPasswordDialog from '$lib/components/ResetPasswordDialog.svelte'

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
	initializeStores()

  const modalRegistry: Record<string, ModalComponent> = {
		winnerDialog: { ref: WinnerDialog },
    openDialog: { ref: OpenDialog },
    saveDialog: { ref: SaveDialog },
    saveLocalDialog: { ref: SaveLocalDialog },
    loginDialog: { ref: LoginDialog },
    signUpDialog: { ref: SignUpDialog },
    // resetPasswordDialog: { ref: ResetPasswordDialog }
	}

  onMount(fullscreenStore.initialize)
</script>

<Modal components={modalRegistry} />

<slot />
