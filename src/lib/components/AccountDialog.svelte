<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import {
    getCurrentUser, sendEmailVerificationEmail, signOut
  } from '$lib/utils/Firebase'
  import { toastDefaults } from '$lib/utils/Toast'

  // TODO: Implement modal

  const toast: ToastContext = getContext('toast')

  let loading = false

  const authUser = getCurrentUser()
  if (!authUser) {
    // modalStore.close()
    // modalStore.trigger({ type: 'component', component: 'loginDialog' })
  }

  const logOut = async () => {
    if (loading) return
    loading = true
    try {
      await signOut()
      // modalStore.close()
      toast.create({
        ...toastDefaults,
        description: 'Logged out',
        duration: 1500
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.create({
          ...toastDefaults,
          description: error.message,
          type: 'error'
        })
      }
    } finally {
      loading = false
    }
  }

  function close() {
    // modalStore.close()
  }
</script>

{#if false}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-user"></i>
      <h1>Account</h1>
    </header>

    {#if !authUser?.emailVerified}
      <aside class="alert preset-tonal-warning">
        <i class="fas fa-exclamation-triangle"></i>

        <p class="alert-message">Your email address is not verified.</p>

        <button
          class="btn btn-sm preset-filled"
          onclick={sendEmailVerificationEmail}
        >
          Send verification email
        </button>
      </aside>
    {/if}

    <section class="flex flex-col gap-2">
      {#if authUser?.displayName}
        <div>
          {authUser?.displayName}
        </div>
      {/if}

      {#if authUser?.email}
        <div>
          Email: <pre>{authUser?.email}</pre>
        </div>
      {/if}

      <div>
        User ID: <pre>{authUser?.uid}</pre>
      </div>

      <div>
        <button
          class="btn preset-tonal-warning"
          onclick={logOut}
        >
          Log out
        </button>
      </div>
    </section>

    <footer class="flex justify-end gap-2">
      <button
        class="btn preset-filled"
        onclick={close}
      >
        Close
      </button>
  </article>
{/if}
