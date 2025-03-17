<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { signIn } from '$lib/utils/Firebase'
  import { toastDefaults } from '$lib/utils/Toast'
  import EmailPasswordForm from '$lib/components/EmailPasswordForm.svelte'

  // TODO: Implement modal

  const toast: ToastContext = getContext('toast')

  let formError: string | null = $state(null)

  const onSubmit = async (user: { email: string, password: string }) => {
    await signIn(user.email, user.password)
    // if ($modalStore[0].meta?.next) {
    //   modalStore.trigger({
    //     type: 'component',
    //     component: $modalStore[0].meta.next
    //   })
    // }
    close()
    toast.create({
      ...toastDefaults,
      description: 'Logged in',
      duration: 2000
    })
  }

  const resetPassword = () => {
    close()
    // modalStore.trigger({ type: 'component', component: 'resetPasswordDialog' })
  }

  const signUp = () => {
    // modalStore.trigger({
    //   type: 'component',
    //   component: 'signUpDialog',
    //   meta: { next: $modalStore[0].meta?.next }
    // })
    close()
  }

  function close() {
    // modalStore.close()
  }
</script>

{#if false}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-user"></i>
      <h1>Log in</h1>
    </header>

    <EmailPasswordForm {onSubmit} {formError}>
      {#snippet body()}
        <div class="flex flex-wrap justify-between gap-2">
          <button
            type="button"
            class="btn btn-sm preset-tonal"
            onclick={resetPassword}
          >
            Forgot password
          </button>

          <button
            type="button"
            class="btn btn-sm preset-tonal"
            onclick={signUp}
          >
            Don't have an account? Sign up
          </button>
        </div>
      {/snippet}

      {#snippet footerButtons()}
        <button
          type="button"
          class="btn preset-tonal"
          onclick={close}
        >
          Close
        </button>
      {/snippet}
    </EmailPasswordForm>
  </article>
{/if}
