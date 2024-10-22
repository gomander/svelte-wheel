<script lang="ts">
  import { TabGroup, Tab } from '@skeletonlabs/skeleton'
  import wheelStore from '$lib/stores/WheelStore'
  import EditorButtons from '$lib/components/EditorButtons.svelte'
  import EntriesTextbox from '$lib/components/EntriesTextbox.svelte'
  import ResultsButtons from '$lib/components/ResultsButtons.svelte'
  import ResultsTextbox from '$lib/components/ResultsTextbox.svelte'

  let openTab = $state(0)
</script>

<TabGroup
  class="flex-1 flex flex-col"
  regionPanel="flex-1 flex flex-col gap-4"
>
  <Tab
    bind:group={openTab}
    name="editor"
    value={0}
  >
    <div class="flex items-center gap-2">
      <span id="entries-label">Entries</span>
      <div>
        <span class="badge variant-filled">{wheelStore.value.entries.length}</span>
      </div>
    </div>
  </Tab>

  <Tab
    bind:group={openTab}
    name="results"
    value={1}
  >
    <div class="flex items-center gap-2">
      <span id="results-label">Results</span>
      <div>
        <span class="badge variant-filled">{wheelStore.value.winners.length}</span>
      </div>
    </div>
  </Tab>

  {#snippet panel()}
    {#if openTab === 0}
      <EditorButtons />

      <EntriesTextbox />
    {:else if openTab === 1}
      <ResultsButtons />

      <ResultsTextbox />
    {/if}
  {/snippet}
</TabGroup>
