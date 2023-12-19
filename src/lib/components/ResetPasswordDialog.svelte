<script lang="ts">
  import {
    getModalStore, getToastStore, ProgressRadial
  } from '@skeletonlabs/skeleton'
  import { z } from 'zod'
  import { sendPasswordResetEmail } from '$lib/utils/Firebase'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let email = ''
  const emailValidator = z.string().email()
  let loading = false
  let errors: Record<string, string[] | undefined> = { }

  const resetPassword = async () => {
    if (loading) return
    loading = true
    try {
      emailValidator.parse(email)
    } catch (error) {
      if (error instanceof z.ZodError) errors = error.flatten().fieldErrors
      return loading = false
    }
    try {
      await sendPasswordResetEmail(email)
      loading = false
      modalStore.close()
      toastStore.trigger({
        message: 'Password reset email sent',
        background: 'variant-filled-primary'
      })
    } catch (error) {
      loading = false
      toastStore.trigger({
        message: 'Something went wrong, please try again later',
        background: 'variant-filled-error'
      })
    }
  }
</script>

{#if $modalStore[0]}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-key" />
      <h1>Reset password</h1>
    </header>

    <form
      class="flex flex-col gap-4"
      on:submit|preventDefault={resetPassword}
    >
      <label class="label">
        <span>Email</span>

        <input
          type="email"
          name="email"
          minlength="6"
          maxlength="64"
          required
          bind:value={email}
          class="input"
        />

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
          on:click={modalStore.close}
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
