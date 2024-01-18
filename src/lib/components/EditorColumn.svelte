<script lang="ts">
  import { TabGroup, Tab } from '@skeletonlabs/skeleton'
	import EditorButtons from '$lib/components/EditorButtons.svelte'
	import EntriesTextbox from '$lib/components/EntriesTextbox.svelte'
  import ResultsButtons from '$lib/components/ResultsButtons.svelte'
	import ResultsTextbox from '$lib/components/ResultsTextbox.svelte'

	let openTab = 0
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
    <span id="entries-label">Entries</span>
  </Tab>

  <Tab
    bind:group={openTab}
    name="results"
    value={1}
  >
    <span id="results-label">Results</span>
  </Tab>

  <svelte:fragment slot="panel">
    {#if openTab === 0}
      <EditorButtons />

      <EntriesTextbox />
    {:else if openTab === 1}
      <ResultsButtons />

      <ResultsTextbox />
    {/if}
  </svelte:fragment>
</TabGroup>
