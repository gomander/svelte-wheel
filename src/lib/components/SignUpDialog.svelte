<script lang="ts">
  import { getContext } from 'svelte'
  import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
  import { registerUser, signIn } from '$lib/utils/Firebase'
  import { toastDefaults } from '$lib/utils/Toast'
  import AppDialog from '$lib/components/AppDialog.svelte'
  import EmailPasswordForm from '$lib/components/EmailPasswordForm.svelte'

  export function open(nextDialog?: string) {
    if (nextDialog) next = nextDialog
    dialog.open()
  }

  let { onLogin, nextDialog }: {
    onLogin: () => void
    nextDialog: (dialogName: string) => void
  } = $props()

  const toast: ToastContext = getContext('toast')

  let formError: string | null = $state(null)
  let dialog: AppDialog = $state(null!)

  let next: string | null = null

  async function onSubmit(user: { email: string, password: string }) {
    await registerUser(user.email, user.password)
    await signIn(user.email, user.password)
    close()
    if (next) nextDialog(next)
    toast.create({
      ...toastDefaults,
      description: 'Account created'
    })
  }

  function login() {
    close()
    onLogin()
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
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
</AppDialog>
