<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { getModalStore, ProgressRadial } from '@skeletonlabs/skeleton'
  import { z } from 'zod'
  import { registerUser, signInUser } from '$lib/utils/Firebase.js'
  import { FirebaseError } from 'firebase/app'

  const modalStore = getModalStore()

  let form: HTMLFormElement

  const user = {
    email: $modalStore[0].meta?.email ?? '',
    password: $modalStore[0].meta?.password ?? '',
    confirmPassword: ''
  }

  let loading = false

  let formError: string | null = null
  let errors: Record<string, string[] | undefined> = { }

  const registerSchema = z.object({
    email: z.string().min(6, 'Invalid email').max(
      64, 'Email must be at most 64 characters'
    ).email(),
    password: z.string().min(
      8, 'Password must be at least 8 characters'
    ).max(64, 'Password must be at most 64 characters').trim(),
    confirmPassword: z.string().min(
      8, 'Password must be at least 8 characters'
    ).max(64, 'Password must be at most 64 characters').trim()
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match', path: ['confirmPassword']
  })

  const signUp = async () => {
    if (loading) return
    loading = true

    try {
      registerSchema.parse(user)
    } catch (error) {
      if (error instanceof z.ZodError) errors = error.flatten().fieldErrors
      return loading = false
    }

    try {
      await registerUser(user.email, user.password)
      await signInUser(user.email, user.password)
      loading = false
      modalStore.close()
    } catch (error) {
      loading = false
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/email-already-in-use'
      ) {
        user.confirmPassword = ''
        form.reset()
        formError = 'Email already in use'
      }
    }
  }

  const login = () => {
    modalStore.close()
    modalStore.trigger({
      type: 'component', component: 'loginDialog', meta: user
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
          bind:value={user.email}
          placeholder="name@domain.com"
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

        <input
          type="password"
          name="password"
          minlength="8"
          maxlength="64"
          required
          bind:value={user.password}
          class="input"
        />

        {#if errors.password}
          <span class="text-sm text-error-400-500-token">
            {errors.password[0]}
          </span>
        {/if}
      </label>

      <label class="label">
        <span>Confirm password</span>

        <input
          type="password"
          name="password"
          minlength="8"
          maxlength="64"
          required
          bind:value={user.confirmPassword}
          class="input"
        />

        {#if errors.confirmPassword}
          <span class="text-sm text-error-400-500-token">
            {errors.confirmPassword[0]}
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
