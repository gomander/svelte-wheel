<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte'
  import { getToastStore } from '@skeletonlabs/skeleton'
  import { toastDefaults } from '$lib/utils/Toast'

  const toastStore = getToastStore()

	const {
    offlineReady, needRefresh, updateServiceWorker
	} = useRegisterSW({
		onRegistered: r => r && setInterval(r.update, 60 * 60 * 1000),
		onRegisterError: error => console.error('SW registration error', error)
	})

  const toast = () => {
    toastStore.trigger({
      ...toastDefaults,
      hideDismiss: false,
      timeout: $offlineReady ? 2000 : 8000,
      message: $offlineReady
        ? 'App ready to work offline'
        : 'New content available, reload the page to update',
      action: $offlineReady ? undefined : {
        label: 'Reload',
        response: () => updateServiceWorker(true)
      },
      hoverable: true,
      callback: (response) => {
        if (response.status === 'closed') {
          offlineReady.set(false)
          needRefresh.set(false)
        }
      }
    })
  }

	$: if ($offlineReady || $needRefresh) toast()
</script>
