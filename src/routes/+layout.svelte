<script lang="ts">
  import '../app.postcss'
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'
  import {
    initializeStores, Modal, Toast, storePopup, type ModalComponent
  } from '@skeletonlabs/skeleton'
  import {
    computePosition, autoUpdate, flip, shift, offset, arrow
  } from '@floating-ui/dom'
  import fullscreenStore from '$lib/stores/FullscreenStore'
  import WinnerDialog from '$lib/components/WinnerDialog.svelte'
  import OpenDialog from '$lib/components/OpenDialog.svelte'
  import OpenCloudDialog from '$lib/components/OpenCloudDialog.svelte'
  import SaveDialog from '$lib/components/SaveDialog.svelte'
  import SaveCloudDialog from '$lib/components/SaveCloudDialog.svelte'
  import SaveLocalDialog from '$lib/components/SaveLocalDialog.svelte'
  import AccountDialog from '$lib/components/AccountDialog.svelte'
  import LoginDialog from '$lib/components/LoginDialog.svelte'
  import SignUpDialog from '$lib/components/SignUpDialog.svelte'
  import ResetPasswordDialog from '$lib/components/ResetPasswordDialog.svelte'
  import CustomizeDialog from '$lib/components/CustomizeDialog.svelte'
  import ShareDialog from '$lib/components/ShareDialog.svelte'

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
  initializeStores()

  const modalRegistry: Record<string, ModalComponent> = {
    winnerDialog: { ref: WinnerDialog },
    openDialog: { ref: OpenDialog },
    openCloudDialog: { ref: OpenCloudDialog },
    saveDialog: { ref: SaveDialog },
    saveCloudDialog: { ref: SaveCloudDialog },
    saveLocalDialog: { ref: SaveLocalDialog },
    accountDialog: { ref: AccountDialog },
    loginDialog: { ref: LoginDialog },
    signUpDialog: { ref: SignUpDialog },
    resetPasswordDialog: { ref: ResetPasswordDialog },
    customizeDialog: { ref: CustomizeDialog },
    shareDialog: { ref: ShareDialog }
  }

  onMount(fullscreenStore.initialize)

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<Toast />

<Modal components={modalRegistry} />

<slot />

{#await import('$lib/components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
