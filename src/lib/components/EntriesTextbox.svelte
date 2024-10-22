<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import busyStore from '$lib/stores/BusyStore.svelte'
  import debugStore from '$lib/stores/DebugStore.svelte'
  import { getNewEntryId, type Entry } from '$lib/utils/Wheel'

  let textarea: HTMLTextAreaElement = $state(null!)

  const text = {
    get value() {
      return wheelStore.entries.map(e => e.text).join('\n')
    },
    set value(value: string) {
      textarea.value = value
      setEntries(textarea.value.split('\n'))
    }
  }

  function setEntries(lines: string[]) {
    let changeStartIndex = lines.length
    const oldEntries = wheelStore.entries
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
    wheelStore.entries = newEntries
  }
</script>

<textarea
  class="textarea w-full h-72 flex-grow resize-none"
  spellcheck="false"
  autocomplete="off"
  maxlength="1000"
  bind:value={text.value}
  bind:this={textarea}
  disabled={busyStore.spinning}
  aria-labelledby="entries-label"
></textarea>

{#if debugStore.active}
  <pre>{wheelStore.entries.map(e => `${e.text} - ${e.id}`).join('\n')}</pre>
{/if}
