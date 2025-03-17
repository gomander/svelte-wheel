<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { signIn } from '$lib/utils/Firebase'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'
  import EmailPasswordForm from '$lib/components/EmailPasswordForm.svelte'

  export function open(nextDialog?: string) {
    if (nextDialog) next = nextDialog
    dialog.open()
  }

  let { onResetPassword, onSignUp, nextDialog }: {
    onResetPassword: () => void
    onSignUp: () => void
    nextDialog: (dialogName: string) => void
  } = $props()

  const toast: ToastContext = getContext('toast')

  let dialog: AppDialog = $state(null!)
  let formError: string | null = $state(null)

  let next: string | null = null

  const onSubmit = async (user: { email: string, password: string }) => {
    await signIn(user.email, user.password)
    close()
    if (next) nextDialog(next)
    toast.create({
      ...toastDefaults,
      description: 'Logged in',
      duration: 2000
    })
  }

  function resetPassword() {
    close()
    onResetPassword()
  }

  function signUp() {
    close()
    onSignUp()
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
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
</AppDialog>
