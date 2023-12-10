<script lang="ts">
  import { wheelStore } from '$lib/stores/WheelStore'
  import { getNewId, type Entry } from '$lib/utils/Wheel'

  let textarea: HTMLTextAreaElement

  $: text = $wheelStore.entries.map(e => e.text).join('\n')

  const setEntries = () => {
    const lines = text.split('\n')
    const entries: Entry[] = lines.map((text, index) => {
      let id = $wheelStore.entries.at(index)?.id
      if (!id || $wheelStore.entries[index]?.text !== text) id = getNewId()
      return { text, id }
    })
    wheelStore.setEntries(entries)
  }
</script>

<textarea
  class="textarea w-full h-72 flex-grow resize-none"
  spellcheck="false"
  autocomplete="off"
  maxlength="1000"
  bind:this={textarea}
  bind:value={text}
  on:input={setEntries}
/>
