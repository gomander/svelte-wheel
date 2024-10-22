<script lang="ts">
  import '../app.postcss'
  import { onMount } from 'svelte'
  import { onNavigate } from '$app/navigation'
  import { pwaInfo } from 'virtual:pwa-info'
  import {
    initializeStores, Modal, Toast, getModalStore, storePopup, type ModalComponent
  } from '@skeletonlabs/skeleton'
  import {
    computePosition, autoUpdate, flip, shift, offset, arrow
  } from '@floating-ui/dom'
  import fullscreenStore from '$lib/stores/FullscreenStore.svelte'
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
  import SharedLinkDialog from '$lib/components/SharedLinkDialog.svelte'
  import DeleteWheelDialog from '$lib/components/DeleteWheelDialog.svelte'
  import { PUBLIC_FIREBASE_MEASUREMENT_ID } from '$env/static/public'

  let { children } = $props()

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
  initializeStores()
  const modalStore = getModalStore()

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
    shareDialog: { ref: ShareDialog },
    sharedLinkDialog: { ref: SharedLinkDialog },
    deleteWheelDialog: { ref: DeleteWheelDialog }
  }

  onMount(fullscreenStore.initialize)
  onNavigate(modalStore.close)

  let webManifestLink = $derived(pwaInfo?.webManifest.linkTag ?? '')
</script>

<svelte:head>
  {@html webManifestLink}
  {#if process.env.NODE_ENV !== 'development'}
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_FIREBASE_MEASUREMENT_ID}"
    ></script>
    {@html `
      <script>
        window.dataLayer = window.dataLayer || []
        function gtag() {
          dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', '${PUBLIC_FIREBASE_MEASUREMENT_ID}')
      </script>
    `}
  {/if}
</svelte:head>

<Toast />

<Modal components={modalRegistry} />

{@render children?.()}

{#await import('$lib/components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
