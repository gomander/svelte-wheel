<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import busyStore from '$lib/stores/BusyStore'
  import debugStore from '$lib/stores/DebugStore'
  import { getNewEntryId, type Entry } from '$lib/utils/Wheel'

  let textarea: HTMLTextAreaElement

  $: text = $wheelStore.entries.map(e => e.text).join('\n')

  function setEntries(e: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) {
    const lines = e.currentTarget.value.split('\n')
    let changeStartIndex = lines.length
    const oldEntries = $wheelStore.entries
    const newEntries: Entry[] = lines.map((text, index) => {
      let id = oldEntries.at(index)?.id
      if (!id || oldEntries.at(index)?.text !== text) {
        if (index < changeStartIndex) {
          changeStartIndex = index
        }
        id = getNewEntryId()
      }
      return { text, id }
    })
    if (lines.length !== oldEntries.length) {
      const stopIndex = lines.length > oldEntries.length
        ? changeStartIndex - newEntries.length
        : changeStartIndex - newEntries.length - 1
      for (let i = -1; i > stopIndex; i--) {
        const newEntry = newEntries.at(i)
        const oldEntry = oldEntries.at(i)
        if (newEntry && newEntry.text === oldEntry?.text) {
          newEntry.id = oldEntry.id
        } else {
          break
        }
      }
    }
    wheelStore.setEntries(newEntries)
  }
</script>

<textarea
  class="textarea w-full h-72 flex-grow resize-none"
  spellcheck="false"
  autocomplete="off"
  maxlength="1000"
  on:input={setEntries}
  bind:value={text}
  bind:this={textarea}
  disabled={$busyStore.spinning}
  aria-labelledby="entries-label"
></textarea>

{#if $debugStore.active}
  <pre>{$wheelStore.entries.map(e => `${e.text} - ${e.id}`).join('\n')}</pre>
{/if}
