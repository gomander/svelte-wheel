<script lang="ts">
  import type { Snippet } from 'svelte'
  import { ProgressRadial } from '@skeletonlabs/skeleton'
  import { z } from 'zod'
  import { FirebaseError } from 'firebase/app'
  import { userSchema } from '$lib/utils/Schemas'

  let { onSubmit, formError, body, footerButtons }: {
    onSubmit: (user: { email: string, password: string }) => Promise<void>,
    formError: string | null,
    body: Snippet,
    footerButtons: Snippet
  } = $props()

  let form: HTMLFormElement = $state(null!)
  let loading = $state(false)
  let errors: Record<string, string[] | undefined> = $state({})

  let passwordInput: HTMLInputElement = $state(null!)
  let showPassword = $state(false)

  const submit = async (e: Event) => {
    e.preventDefault()
    if (loading) return
    loading = true
    formError = null
    const formData = new FormData(form)
    const user = {
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    }
    try {
      userSchema.parse(user)
      await onSubmit(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = error.flatten().fieldErrors
      }
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          formError = 'Email already in use'
        }
        if (error.code === 'auth/invalid-credential') {
          formError = 'Invalid email or password'
        }
      }
    } finally {
      loading = false
    }
  }
</script>

{#if formError}
  <div class="alert variant-soft-error">{formError}</div>
{/if}

<form
  class="flex flex-col gap-4"
  bind:this={form}
  onsubmit={submit}
>
  <label class="label">
    <span class="required">Email</span>
    <input
      type="email"
      name="email"
      minlength="6"
      maxlength="64"
      required
      class="input"
    >

    {#if errors.email}
      <span class="text-sm text-error-400-500-token">{errors.email[0]}</span>
    {/if}
  </label>

  <label class="label">
    <span class="required">Password</span>
    <div class="input-group grid-cols-[1fr_auto]">
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        minlength="8"
        maxlength="64"
        required
        bind:this={passwordInput}
      >

      <button
        type="button"
        class="btn variant-soft rounded-none"
        onclick={() => showPassword = !showPassword}
        title={showPassword ? 'Hide password' : 'Show password'}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        <i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'} w-6"></i>
      </button>
    </div>

    {#if errors.password}
      <span class="text-sm text-error-400-500-token">{errors.password[0]}</span>
    {/if}
  </label>

  {@render body()}

  <footer class="flex justify-end gap-2">
    {@render footerButtons()}

    <button
      class="btn variant-filled-primary"
      aria-busy={loading}
    >
      {#if loading}
        <ProgressRadial width="w-6" />
      {:else}
        Submit
      {/if}
    </button>
  </footer>
</form>
