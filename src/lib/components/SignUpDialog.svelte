<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { registerUser, signIn } from '$lib/utils/Firebase.js'
  import { FirebaseError } from 'firebase/app'
  import EmailPasswordForm from '$lib/components/EmailPasswordForm.svelte'

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  let formError: string | null = null

  const onSubmit = async (user: { email: string, password: string }) => {
    try {
      await registerUser(user.email, user.password)
      await signIn(user.email, user.password)
      modalStore.close()
      toastStore.trigger({
        message: 'Account created successfully',
        background: 'variant-filled-primary'
      })
    } catch (error) {
      formError = error instanceof FirebaseError && error.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : 'Something went wrong'
    }
  }

  const login = () => {
    modalStore.close()
    modalStore.trigger({ type: 'component', component: 'loginDialog' })
  }

  onNavigate(modalStore.close)
</script>

{#if $modalStore[0]}
  <article class="card p-4 w-modal shadow-lg overflow-hidden flex flex-col gap-4">
    <header class="h3 flex items-center gap-2">
      <i class="fas fa-user" />
      <h1>Sign up</h1>
    </header>

    <EmailPasswordForm
      {onSubmit}
      {formError}
    >
      <div>
        <button
          class="btn btn-sm variant-soft"
          on:click={login}
        >
          Already have an account? Log in
        </button>
      </div>

      <button
        slot="footer-buttons"
        class="btn variant-soft"
        on:click={modalStore.close}
      >
        Close
      </button>

      <span slot="submit-button">Sign up</span>
    </EmailPasswordForm>
  </article>
{/if}
