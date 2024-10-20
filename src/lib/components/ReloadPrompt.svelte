<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte'
  import { getToastStore } from '@skeletonlabs/skeleton'
  import { toastDefaults } from '$lib/utils/Toast'

  const toastStore = getToastStore()

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered: r => r && setInterval(r.update, 4 * 60 * 60 * 1000),
    onRegisterError: error => console.error('SW registration error', error)
  })

  const toast = () => {
    toastStore.trigger({
      ...toastDefaults,
      hideDismiss: false,
      timeout: 8000,
      message: 'Update available',
      action: {
        label: 'Reload',
        response: () => updateServiceWorker(true)
      },
      hoverable: true,
      callback: (response) => {
        if (response.status === 'closed') {
          needRefresh.set(false)
        }
      }
    })
  }

  $effect(() => {
    if ($needRefresh) toast()
  })
</script>
