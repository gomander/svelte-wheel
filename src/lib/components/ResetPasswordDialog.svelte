<script lang="ts">
  import { getContext } from 'svelte'
  import { ProgressRing, type ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { z } from 'zod'
  import { sendPasswordResetEmail } from '$lib/utils/Firebase'
  import { emailValidator } from '$lib/utils/Schemas'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open() {
    dialog.open()
  }

  const toast: ToastContext = getContext('toast')

  let email = $state('')
  let loading = $state(false)
  let errors: Record<string, string[] | undefined> = $state({ })
  let dialog: AppDialog = $state(null!)

  async function resetPassword(e: SubmitEvent) {
    e.preventDefault()
    if (loading) return
    loading = true
    try {
      emailValidator.parse(email)
      await sendPasswordResetEmail(email)
      close()
      toast.create({
        ...toastDefaults,
        description: 'Password reset email sent'
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = error.flatten().fieldErrors
        return
      }
      toast.create({
        ...toastDefaults,
        description: 'Something went wrong, please try again later',
        type: 'error'
      })
    } finally {
      loading = false
    }
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-key"></i>
      <h1>Reset password</h1>
    </header>

    <form
      class="flex flex-col gap-4"
      onsubmit={resetPassword}
    >
      <label class="label">
        <span class="required">Email</span>
        <input
          type="email"
          name="email"
          minlength="6"
          maxlength="64"
          required
          bind:value={email}
          class="input"
        >

        {#if errors.email}
          <span class="text-sm text-error-500">
            {errors.email[0]}
          </span>
        {/if}
      </label>

      <footer class="flex justify-end gap-2">
        <button
          type="button"
          class="btn btn-sm preset-tonal"
          onclick={close}
        >
          Close
        </button>

        <button
          class="btn preset-filled-primary-500"
          aria-busy={loading}
        >
          {#if loading}
            <ProgressRing size="w-6" />
          {:else}
            Send password reset email
          {/if}
        </button>
      </footer>
    </form>
  </article>
</AppDialog>
