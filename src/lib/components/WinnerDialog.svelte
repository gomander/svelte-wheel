<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import { getTextColor } from '$lib/utils/FontPicker'

  // TODO: Implement modal

  const remove = () => {
    // wheelStore.entries = wheelStore.entries.filter(e => e.id !== $modalStore[0].meta.winner.id)
    close()
  }

  function close() {
    // modalStore.close()
  }
</script>

{#if false}
  <article class="card w-modal shadow-xl overflow-hidden">
    <header
      class="p-4 text-2xl font-semibold"
      style:color={getTextColor('#000000')}
      style:background-color={'#000000'}
    >
      <!-- {$modalStore[0].title} -->
      We have a winner!
    </header>

    <div
      class="p-4 h1"
      aria-label="Winner"
    >
      <!-- {$modalStore[0].body} -->
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
{/if}
