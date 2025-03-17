<script lang="ts">
  import { Segment } from '@skeletonlabs/skeleton-svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import fullscreenStore from '$lib/stores/FullscreenStore.svelte'
  import debugStore from '$lib/stores/DebugStore.svelte'
  import { launchConfetti } from '$lib/utils/ConfettiLauncher'
  import type { OnStoppedData } from '$lib/utils/Wheel'
  import AboutCards from '$lib/components/AboutCards.svelte'
  import AccountDialog from '$lib/components/AccountDialog.svelte'
  import CustomizeDialog from '$lib/components/CustomizeDialog.svelte'
  import DeleteWheelDialog from '$lib/components/DeleteWheelDialog.svelte'
  import EditorColumn from '$lib/components/EditorColumn.svelte'
  import LoginDialog from '$lib/components/LoginDialog.svelte'
  import OpenCloudDialog from '$lib/components/OpenCloudDialog.svelte'
  import OpenDialog from '$lib/components/OpenDialog.svelte'
  import ResetPasswordDialog from '$lib/components/ResetPasswordDialog.svelte'
  import SaveCloudDialog from '$lib/components/SaveCloudDialog.svelte'
  import SaveDialog from '$lib/components/SaveDialog.svelte'
  import SaveLocalDialog from '$lib/components/SaveLocalDialog.svelte'
  import ShareDialog from '$lib/components/ShareDialog.svelte'
  import SharedLinkDialog from '$lib/components/SharedLinkDialog.svelte'
  import SignUpDialog from '$lib/components/SignUpDialog.svelte'
  import Toolbar from '$lib/components/Toolbar.svelte'
  import WinnerDialog from '$lib/components/WinnerDialog.svelte'
  import Wheel from '$lib/components/Wheel.svelte'

  let wheelComponent = $state('single')

  let accountDialog: AccountDialog = $state(null!)
  let customizeDialog: CustomizeDialog = $state(null!)
  let deleteWheelDialog: DeleteWheelDialog = $state(null!)
  let loginDialog: LoginDialog = $state(null!)
  let openCloudDialog: OpenCloudDialog = $state(null!)
  let openDialog: OpenDialog = $state(null!)
  let resetPasswordDialog: ResetPasswordDialog = $state(null!)
  let saveCloudDialog: SaveCloudDialog = $state(null!)
  let saveDialog: SaveDialog = $state(null!)
  let saveLocalDialog: SaveLocalDialog = $state(null!)
  let shareDialog: ShareDialog = $state(null!)
  let sharedLinkDialog: SharedLinkDialog = $state(null!)
  let signUpDialog: SignUpDialog = $state(null!)
  let winnerDialog: WinnerDialog = $state(null!)

  function onStop(data: OnStoppedData) {
    launchConfetti(
      wheelStore.config.confetti,
      $state.snapshot(wheelStore.config.colors)
    )
    if (!wheelStore.config.displayWinnerDialog) return
    winnerDialog.open(data.winner, wheelStore.config.winnerMessage, data.color)
  }

  function nextDialog(next: string) {
    if (next === 'account') accountDialog.open()
    if (next === 'openCloud') openCloudDialog.open()
    if (next === 'saveCloud') saveCloudDialog.open()
    if (next === 'share') shareDialog.open()
  }
</script>

<svelte:head>
  {#if wheelStore.config.title}
    <title>{wheelStore.config.title} - Svelte Wheel</title>
  {:else}
    <title>Svelte Wheel</title>
  {/if}
  <meta
    property="og:image"
    content="https://sveltewheel.com/images/sveltewheel.webp"
  >
  <meta name="theme-color" content="#022a4f">
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Toolbar
    onNew={wheelStore.reset}
    onOpen={openDialog.open}
    onSave={saveDialog.open}
    onCustomize={customizeDialog.open}
    onShare={shareDialog.open}
    onAccount={accountDialog.open}
    onDebug={debugStore.toggle}
  />

  <main class="grow flex flex-col xl:grid grid-cols-4">
    <div class="col-span-1 pb-0 p-4 xl:pb-4 xl:pr-0 flex flex-col justify-between">
      {#if !fullscreenStore.active}
        <div>
          <h2 class="text-3xl" aria-label="Wheel title">
            {wheelStore.config.title}
          </h2>
          <p class="text-lg" aria-label="Wheel description">
            {wheelStore.config.description}
          </p>
          {#if debugStore.active}
            <Segment
              value={wheelComponent}
              onValueChange={(e) => (wheelComponent = e.value!)}
            >
              <Segment.Item value="single">Single-thread</Segment.Item>
              <Segment.Item value="multi">Multi-thread</Segment.Item>
            </Segment>
          {/if}
        </div>

        <p class="hidden xl:block sticky bottom-4 text-sm" aria-hidden="true">
          Scroll down to read about this project!
        </p>
      {/if}
    </div>

    <div class="col-span-2 flex-1 flex flex-col justify-center items-center">
      {#if wheelComponent === 'single'}
        <Wheel {onStop} />
      {:else}
        {#await import('$lib/components/WheelMultiThread.svelte') then { default: WheelMultiThread }}
          <WheelMultiThread {onStop} />
        {/await}
      {/if}
    </div>

    <div class="col-span-1 pt-0 p-4 xl:pt-4 xl:pl-0 flex flex-col">
      {#if !fullscreenStore.active}
        <EditorColumn />
      {/if}
    </div>
  </main>
</div>

{#if !fullscreenStore.active}
  <hr>

  <aside class="p-4 flex justify-center">
    <AboutCards />
  </aside>
{/if}

<AccountDialog
  bind:this={accountDialog}
  onNotLoggedIn={() => loginDialog.open('account')}
/>

<CustomizeDialog bind:this={customizeDialog} />

<DeleteWheelDialog bind:this={deleteWheelDialog} />

<LoginDialog
  bind:this={loginDialog}
  onResetPassword={resetPasswordDialog.open}
  onSignUp={signUpDialog.open}
  {nextDialog}
/>

<OpenCloudDialog
  bind:this={openCloudDialog}
  onDelete={deleteWheelDialog.open}
  onNotLoggedIn={() => loginDialog.open('openCloud')}
/>

<OpenDialog
  bind:this={openDialog}
  onOpenCloud={openCloudDialog.open}
/>

<ResetPasswordDialog bind:this={resetPasswordDialog} />

<SaveCloudDialog
  bind:this={saveCloudDialog}
  onNotLoggedIn={() => loginDialog.open('saveCloud')}
/>

<SaveDialog
  bind:this={saveDialog}
  onSaveCloud={saveCloudDialog.open}
  onSaveLocal={saveLocalDialog.open}
/>

<SaveLocalDialog bind:this={saveLocalDialog} />

<ShareDialog
  bind:this={shareDialog}
  onNotLoggedIn={() => loginDialog.open('share')}
  onShare={(path) => sharedLinkDialog.open(path)}
/>

<SharedLinkDialog bind:this={sharedLinkDialog} />

<SignUpDialog
  bind:this={signUpDialog}
  onLogin={loginDialog.open}
  {nextDialog}
/>

<WinnerDialog bind:this={winnerDialog} />
