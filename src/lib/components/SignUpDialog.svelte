<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import {
    getModalStore, getToastStore, ProgressRadial
  } from '@skeletonlabs/skeleton'
  import { z } from 'zod'
  import { registerUser, signIn } from '$lib/utils/Firebase.js'
  import { FirebaseError } from 'firebase/app'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let form: HTMLFormElement

  let loading = false
  let formError: string | null = null
  let errors: Record<string, string[] | undefined> = { }

  let passwordInput: HTMLInputElement
  let showPassword = false

  const registerSchema = z.object({
    email: z.string().min(6, 'Invalid email').max(
      64, 'Email must be at most 64 characters'
    ).email(),
    password: z.string().min(
      8, 'Password must be at least 8 characters'
    ).max(64, 'Password must be at most 64 characters').trim()
  })

  const signUp = async () => {
    if (loading) return
    loading = true

    const formData = new FormData(form)
    const user = {
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    }

    try {
      registerSchema.parse(user)
    } catch (error) {
      if (error instanceof z.ZodError) errors = error.flatten().fieldErrors
      return loading = false
    }

    try {
      await registerUser(user.email, user.password)
      await signIn(user.email, user.password)
      loading = false
      modalStore.close()
      toastStore.trigger({
        message: 'Account created successfully',
        background: 'variant-filled-primary'
      })
    } catch (error) {
      loading = false
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/email-already-in-use'
      ) {
        form.reset()
        formError = 'Email already in use'
      }
    }
  }

  const login = () => {
    const formData = new FormData(form)
    modalStore.close()
    modalStore.trigger({
      type: 'component',
      component: 'loginDialog',
      meta: {
        email: String(formData.get('email')),
        password: String(formData.get('password'))
      }
    })
  }

  onNavigate(modalStore.close)
</script>

{#if $modalStore[0]}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-user" />
      <h1>Sign up</h1>
    </header>

    {#if formError}
      <div class="alert variant-soft-error">{formError}</div>
    {/if}

    <form
      class="flex flex-col gap-4"
      bind:this={form}
      on:submit|preventDefault={signUp}
    >
      <label class="label">
        <span>Email</span>

        <input
          type="email"
          name="email"
          minlength="6"
          maxlength="64"
          required
          value={$modalStore[0].meta?.email ?? ''}
          class="input"
        />

        {#if errors.email}
          <span class="text-sm text-error-400-500-token">
            {errors.email[0]}
          </span>
        {/if}
      </label>

      <label class="label">
        <span>Password</span>

        <div class="input-group grid-cols-[1fr_auto]">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            minlength="8"
            maxlength="64"
            required
            value={$modalStore[0].meta?.password ?? ''}
            bind:this={passwordInput}
          />

          <button
            type="button"
            class="btn variant-soft rounded-none"
            on:click={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'} w-6" />
          </button>
        </div>

        {#if errors.password}
          <span class="text-sm text-error-400-500-token">
            {errors.password[0]}
          </span>
        {/if}
      </label>

      <div>
        <button
          type="button"
          class="btn btn-sm variant-soft"
          on:click={login}
        >
          Already have an account? Log in
        </button>
      </div>

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
          disabled={loading}
        >
          {#if loading}
            <ProgressRadial width="w-6" />
          {:else}
            Sign up
          {/if}
        </button>
      </footer>
    </form>
  </article>
{/if}
