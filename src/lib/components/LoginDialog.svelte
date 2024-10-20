<script lang="ts">
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { signIn } from '$lib/utils/Firebase'
  import { toastDefaults } from '$lib/utils/Toast'
  import EmailPasswordForm from '$lib/components/EmailPasswordForm.svelte'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let formError: string | null = $state(null)

  const onSubmit = async (user: { email: string, password: string }) => {
    await signIn(user.email, user.password)
    if ($modalStore[0].meta?.next) {
      modalStore.trigger({
        type: 'component',
        component: $modalStore[0].meta.next
      })
    }
    modalStore.close()
    toastStore.trigger({
      ...toastDefaults,
      message: 'Logged in',
      background: 'variant-filled-primary',
      timeout: 2000
    })
  }

  const resetPassword = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'resetPasswordDialog' })
  }

  const signUp = () => {
    modalStore.trigger({
      type: 'component',
      component: 'signUpDialog',
      meta: { next: $modalStore[0].meta?.next }
    })
    modalStore.close()
  }
</script>

{#if $modalStore[0]}
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
            class="btn btn-sm variant-soft"
            onclick={resetPassword}
          >
            Forgot password
          </button>

          <button
            type="button"
            class="btn btn-sm variant-soft"
            onclick={signUp}
          >
            Don't have an account? Sign up
          </button>
        </div>
      {/snippet}

      {#snippet footerButtons()}
        <button
          type="button"
          class="btn variant-soft"
          onclick={modalStore.close}
        >
          Close
        </button>
      {/snippet}
    </EmailPasswordForm>
  </article>
{/if}
