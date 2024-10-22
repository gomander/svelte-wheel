<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import debugStore from '$lib/stores/DebugStore'

  const text = {
    get value() {
      return wheelStore.value.winners.map(e => e.text).join('\n')
    }
  }
</script>

<textarea
  class="textarea w-full h-72 flex-grow resize-none"
  spellcheck="false"
  autocomplete="off"
  readonly
  bind:value={text.value}
  aria-labelledby="results-label"
></textarea>

{#if $debugStore.active}
  <pre>{wheelStore.value.winners.map(e => `${e.text} - ${e.id}`).join('\n')}</pre>
{/if}
