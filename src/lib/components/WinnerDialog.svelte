<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import { getTextColor } from '$lib/utils/FontPicker'
  import type { Entry } from '$lib/utils/Wheel'
  import AppDialog from '$lib/components/AppDialog.svelte'

  export function open(
    winner: Entry,
    message: string | null = null,
    color: string | null = null
  ) {
    entry = winner
    title = message || 'We have a winner!'
    headerColor = color
    dialog.open()
  }

  let dialog: AppDialog = $state(null!)
  let entry: Entry = $state({ id: '', text: '' })
  let title = $state('')
  let headerColor: string | null = $state(null)

  function remove() {
    wheelStore.entries = wheelStore.entries.filter(e => e.id !== entry.id)
    close()
  }

  function close() {
    dialog.close()
  }
</script>

<AppDialog bind:this={dialog}>
  <article>
    <header
      class="p-4 text-2xl font-semibold"
      style:color={headerColor ? getTextColor(headerColor) : 'inherit'}
      style:background-color={headerColor ? headerColor : 'inherit'}
    >
      {title}
    </header>

    <div
      class="p-4 h1"
      aria-label="Winner"
    >
      {entry.text}
    </div>

    <footer class="p-4 flex justify-end gap-2 md:gap-4">
      <button class="btn preset-tonal" onclick={close}>
        Close
      </button>
      <button class="btn preset-tonal-warning" onclick={remove}>
        Remove
      </button>
    </footer>
  </article>
</AppDialog>
