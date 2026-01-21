import { createToaster } from '@skeletonlabs/skeleton-svelte'

export const toastDefaults = {
  duration: 3000,
  type: "info",
} as const

export const toast = createToaster()
