<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'
  import { ToastProvider } from '@skeletonlabs/skeleton-svelte'
  import fullscreenStore from '$lib/stores/FullscreenStore.svelte'
  import { PUBLIC_FIREBASE_MEASUREMENT_ID } from '$env/static/public'

  let { children } = $props()

  onMount(fullscreenStore.initialize)

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
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', '${PUBLIC_FIREBASE_MEASUREMENT_ID}');
      </script>
    `}
  {/if}
</svelte:head>

<ToastProvider>
  {@render children()}
</ToastProvider>

{#await import('$lib/components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
