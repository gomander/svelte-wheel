<script lang="ts">
  import { wheelStore } from '$lib/stores/WheelStore'

  $: text = $wheelStore.winners.map(e => e.text).join('\n')
</script>

<textarea
  class="textarea w-full h-72 flex-grow resize-none"
  spellcheck="false"
  autocomplete="off"
  readonly
  bind:value={text}
  aria-label="Results"
/>
