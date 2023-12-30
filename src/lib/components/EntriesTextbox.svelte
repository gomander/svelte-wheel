<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import busyStore from '$lib/stores/BusyStore'
  import { getNewEntryId, type Entry } from '$lib/utils/Wheel'

  let textarea: HTMLTextAreaElement

  $: text = $wheelStore.entries.map(e => e.text).join('\n')

  const setEntries = () => {
    const lines = text.split('\n')
    let changeStartIndex = lines.length
    const entries: Entry[] = lines.map((text, index) => {
      let id = $wheelStore.entries.at(index)?.id
      if (!id || $wheelStore.entries.at(index)?.text !== text) {
        if (index < changeStartIndex) changeStartIndex = index
        id = getNewEntryId()
      }
      return { text, id }
    })
    if (lines.length !== $wheelStore.entries.length) {
      const stopIndex = lines.length > $wheelStore.entries.length
        ? changeStartIndex - entries.length
        : changeStartIndex - entries.length - 1
      for (let i = -1; i > stopIndex; i--) {
        if ($wheelStore.entries.at(i)?.text === entries.at(i)?.text) {
          entries.at(i)!.id = $wheelStore.entries.at(i)!.id
        } else break
      }
    }
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
  disabled={$busyStore.spinning}
  aria-label="Entries"
/>
