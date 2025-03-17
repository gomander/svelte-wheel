<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { registerUser, signIn } from '$lib/utils/Firebase'
  import { toastDefaults } from '$lib/utils/Toast'
  import EmailPasswordForm from '$lib/components/EmailPasswordForm.svelte'

  // TODO: Implement modal

  const toast: ToastContext = getContext('toast')

  let formError: string | null = $state(null)

  const onSubmit = async (user: { email: string, password: string }) => {
    await registerUser(user.email, user.password)
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
      description: 'Account created'
    })
  }

  const login = () => {
    // modalStore.trigger({
    //   type: 'component',
    //   component: 'loginDialog',
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
      <h1>Sign up</h1>
    </header>

    <EmailPasswordForm {onSubmit} {formError}>
      {#snippet body()}
        <div>
          <button
            type="button"
            class="btn btn-sm preset-tonal"
            onclick={login}
          >
            Already have an account? Log in
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
