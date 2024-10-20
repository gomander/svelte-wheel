<script lang="ts">
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import {
    getCurrentUser, sendEmailVerificationEmail, signOut
  } from '$lib/utils/Firebase'
  import { toastDefaults } from '$lib/utils/Toast'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let loading = false

  const authUser = getCurrentUser()
  if (!authUser) {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'loginDialog' })
  }

  const logOut = async () => {
    if (loading) return
    loading = true
    try {
      await signOut()
      modalStore.close()
      toastStore.trigger({
        ...toastDefaults,
        message: 'Logged out',
        timeout: 1500
      })
    } catch (error) {
      if (error instanceof Error) {
        toastStore.trigger({
          ...toastDefaults,
          message: error.message,
          background: 'variant-filled-error'
        })
      }
    } finally {
      loading = false
    }
  }
</script>

{#if $modalStore[0]}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-user"></i>
      <h1>Account</h1>
    </header>

    {#if !authUser?.emailVerified}
      <aside class="alert variant-soft-warning">
        <i class="fas fa-exclamation-triangle"></i>

        <p class="alert-message">Your email address is not verified.</p>

        <button
          class="btn btn-sm variant-filled"
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
          class="btn variant-soft-warning"
          onclick={logOut}
        >
          Log out
        </button>
      </div>
    </section>

    <footer class="flex justify-end gap-2">
      <button
        class="btn variant-filled"
        onclick={modalStore.close}
      >
        Close
      </button>
  </article>
{/if}
