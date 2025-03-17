<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { getCurrentUser, sendEmailVerificationEmail, signOut } from '$lib/utils/Firebase'
  import { getStringFromError } from '$lib/utils/General'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open() {
    user = getCurrentUser()
    if (!user) {
      onNotLoggedIn()
      return
    }
    dialog.open()
  }

  let { onNotLoggedIn }: { onNotLoggedIn: () => void } = $props()

  const toast: ToastContext = getContext('toast')

  let user: ReturnType<typeof getCurrentUser> = $state(null)
  let dialog: AppDialog = $state(null!)

  let loading = false

  async function logOut() {
    if (loading) return
    loading = true
    try {
      await signOut()
      close()
      toast.create({
        ...toastDefaults,
        description: 'Logged out',
        duration: 1500
      })
    } catch (error) {
      toast.create({
        ...toastDefaults,
        description: getStringFromError(error),
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
      <i class="fas fa-user"></i>
      <h1>Account</h1>
    </header>

    {#if !user?.emailVerified}
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
      {#if user?.displayName}
        <div>
          {user?.displayName}
        </div>
      {/if}

      {#if user?.email}
        <div>
          Email: <pre>{user?.email}</pre>
        </div>
      {/if}

      <div>
        User ID: <pre>{user?.uid}</pre>
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
</AppDialog>
