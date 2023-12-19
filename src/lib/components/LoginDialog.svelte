<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { signIn } from '$lib/utils/Firebase.js'
  import { FirebaseError } from 'firebase/app'
  import EmailPasswordForm from '$lib/components/EmailPasswordForm.svelte'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let formError: string | null = null

  const onSubmit = async (user: { email: string, password: string }) => {
    try {
      await signIn(user.email, user.password)
      modalStore.close()
      toastStore.trigger({
        message: 'Logged in successfully',
        background: 'variant-filled-primary'
      })
    } catch (error) {
      formError = error instanceof FirebaseError && error.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : 'Something went wrong'
    }
  }

  const resetPassword = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'resetPasswordDialog' })
  }

  const signUp = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'signUpDialog' })
  }

  onNavigate(modalStore.close)
</script>

{#if $modalStore[0]}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-user" />
      <h1>Log in</h1>
    </header>

    <EmailPasswordForm
      {onSubmit}
      {formError}
    >
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

      <button
        slot="footer-buttons"
        class="btn variant-soft"
        on:click={modalStore.close}
      >
        Close
      </button>

      <span slot="submit-button">Log in</span>
    </EmailPasswordForm>
  </article>
{/if}
