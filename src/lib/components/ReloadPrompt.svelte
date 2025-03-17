<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { useRegisterSW } from 'virtual:pwa-register/svelte'
  import { toastDefaults } from '$lib/utils/Toast'

  const toast: ToastContext = getContext('toast')

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered: r => r && setInterval(r.update, 4 * 60 * 60 * 1000),
    onRegisterError: error => console.error('SW registration error', error)
  })

  function showToast() {
    toast.create({
      ...toastDefaults,
      duration: 8000,
      description: 'Update available'
    })
  }

  $effect(() => {
    if ($needRefresh) showToast()
  })
</script>
