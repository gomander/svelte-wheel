<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import debugStore from '$lib/stores/DebugStore.svelte'

  const text = {
    get value() {
      return wheelStore.winners.map(e => e.text).join('\n')
    }
  }
</script>

<textarea
  class="textarea w-full h-72 grow resize-none backdrop-blur-xl"
  spellcheck="false"
  autocomplete="off"
  readonly
  bind:value={text.value}
  aria-labelledby="results-label"
></textarea>

{#if debugStore.active}
  <pre>{wheelStore.winners.map(e => `${e.text} - ${e.id}`).join('\n')}</pre>
{/if}

<style>
  textarea {
    background-color: color-mix(in oklab, var(--color-surface-50-950), transparent);
  }
</style>
