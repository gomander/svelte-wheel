<script lang="ts">
  import { goto } from '$app/navigation'
  import { ProgressRadial } from '@skeletonlabs/skeleton'
  import { z } from 'zod'
  import { signInUser } from '$lib/utils/Firebase.js'

  const user = {
    email: '',
    password: ''
  }

  let loading = false

  let errors: Record<string, string[] | undefined> = { }

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().trim()
  })

  const logIn = async () => {
    if (loading) return
    loading = true

    try {
      loginSchema.parse(user)
    } catch (error) {
      if (error instanceof z.ZodError) errors = error.flatten().fieldErrors
      return loading = false
    }

    try {
      await signInUser(user.email, user.password)
      loading = false
    } catch (error) {
      loading = false
      return console.log(error)
    }

    goto('/')
  }
</script>

<svelte:head>
  <title>Log in - Svelte Wheel</title>
</svelte:head>

<main class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
  <header class="h3 flex items-center gap-2">
    <i class="fas fa-user" />
    <h1>Log in</h1>
  </header>

  <form
    class="flex flex-col gap-4"
    on:submit|preventDefault={logIn}
  >
    <label class="label">
      <span>Email</span>

      <!-- svelte-ignore a11y-autofocus -->
      <input
        type="email"
        name="email"
        minlength="6"
        maxlength="64"
        required
        bind:value={user.email}
        placeholder="name@domain.com"
        autofocus={true}
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

    <div class="flex justify-end">
      <button
        class="btn variant-filled-primary"
        disabled={loading}
      >
        {#if loading}
          <ProgressRadial width="w-6" />
        {:else}
          Log in
        {/if}
      </button>
    </div>
  </form>
</main>

<aside class="flex justify-center mt-4">
  <a href="/signup" class="text-sm">
    Need an account? Sign up
  </a>
</aside>
