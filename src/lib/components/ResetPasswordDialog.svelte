<script lang="ts">
  import {
    getModalStore, getToastStore, ProgressRadial
  } from '@skeletonlabs/skeleton'
  import { z } from 'zod'
  import { sendPasswordResetEmail } from '$lib/utils/Firebase'
  import { emailValidator } from '$lib/utils/Schemas'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let email = $state('')
  let loading = $state(false)
  let errors: Record<string, string[] | undefined> = $state({ })

  const resetPassword = async (e: Event) => {
    e.preventDefault()
    if (loading) return
    loading = true
    try {
      emailValidator.parse(email)
      await sendPasswordResetEmail(email)
      modalStore.close()
      toastStore.trigger({
        ...toastDefaults,
        message: 'Password reset email sent',
        background: 'variant-filled-primary'
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = error.flatten().fieldErrors
        return
      }
      toastStore.trigger({
        ...toastDefaults,
        message: 'Something went wrong, please try again later',
        background: 'variant-filled-error'
      })
    } finally {
      loading = false
    }
  }
</script>

{#if $modalStore[0]}
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
          <span class="text-sm text-error-400-500-token">
            {errors.email[0]}
          </span>
        {/if}
      </label>

      <footer class="flex justify-end gap-2">
        <button
          type="button"
          class="btn btn-sm variant-soft"
          onclick={modalStore.close}
        >
          Close
        </button>

        <button
          class="btn variant-filled-primary"
          aria-busy={loading}
        >
          {#if loading}
            <ProgressRadial width="w-6" />
          {:else}
            Send password reset email
          {/if}
        </button>
      </footer>
    </form>
  </article>
{/if}
