<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { getModalStore, ProgressRadial } from '@skeletonlabs/skeleton'
  import { z } from 'zod'
  import { signInUser } from '$lib/utils/Firebase.js'
  import { FirebaseError } from 'firebase/app'

  const modalStore = getModalStore()

  const user = {
    email: $modalStore[0].meta?.email ?? '',
    password: $modalStore[0].meta?.password ?? ''
  }

  let loading = false

  let formError: string | null = null
  let errors: Record<string, string[] | undefined> = { }

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().trim()
  })

  const logIn = async () => {
    if (loading) return
    loading = true
    formError = null

    try {
      loginSchema.parse(user)
    } catch (error) {
      if (error instanceof z.ZodError) errors = error.flatten().fieldErrors
      return loading = false
    }

    try {
      await signInUser(user.email, user.password)
      loading = false
      modalStore.close()
    } catch (error) {
      loading = false
      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        user.password = ''
        formError = 'Invalid email or password'
      }
    }
  }

  const resetPassword = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'resetPasswordDialog' })
  }

  const signUp = () => {
    modalStore.close()
    modalStore.trigger({
      type: 'component',
      component: 'signUpDialog',
      meta: user
    })
  }

  onNavigate(modalStore.close)
</script>

{#if $modalStore[0]}
<article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
  <header class="h3 flex items-center gap-2">
    <i class="fas fa-user" />
    <h1>Log in</h1>
  </header>

  {#if formError}
    <div class="alert variant-soft-error">{formError}</div>
  {/if}

  <form
    class="flex flex-col gap-4"
    on:submit|preventDefault={logIn}
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

    <div class="flex flex-wrap justify-between gap-2">
      <button
        type="button"
        class="btn btn-sm variant-soft"
        on:click={resetPassword}
      >
        Forgot password
      </button>

      <button
        type="button"
        class="btn btn-sm variant-soft"
        on:click={signUp}
      >
        Don't have an account? Sign up
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
        aria-busy={loading}
      >
        {#if loading}
          <ProgressRadial width="w-6" />
        {:else}
          Log in
        {/if}
      </button>
    </footer>
  </form>
</article>
{/if}
