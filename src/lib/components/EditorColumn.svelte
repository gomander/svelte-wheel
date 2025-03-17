<script lang="ts">
  import { Tabs } from '@skeletonlabs/skeleton-svelte'
  import wheelStore from '$lib/stores/WheelStore'
  import EditorButtons from '$lib/components/EditorButtons.svelte'
  import EntriesTextbox from '$lib/components/EntriesTextbox.svelte'
  import ResultsButtons from '$lib/components/ResultsButtons.svelte'
  import ResultsTextbox from '$lib/components/ResultsTextbox.svelte'

  let openTab = $state('editor')
</script>

<Tabs value={openTab} onValueChange={(e) => (openTab = e.value)}>
  {#snippet list()}
    <Tabs.Control value="editor">
      <div class="flex items-center gap-2">
        <span id="entries-label">Entries</span>
        <div>
          <span class="badge preset-filled">{wheelStore.entries.length}</span>
        </div>
      </div>
    </Tabs.Control>
    <Tabs.Control value="results">
      <div class="flex items-center gap-2">
        <span id="results-label">Results</span>
        <div>
          <span class="badge preset-filled">{wheelStore.winners.length}</span>
        </div>
      </div>
    </Tabs.Control>
  {/snippet}
  {#snippet content()}
    <Tabs.Panel value="editor">
      <EditorButtons />
      <EntriesTextbox />
    </Tabs.Panel>
    <Tabs.Panel value="results">
      <ResultsButtons />
      <ResultsTextbox />
    </Tabs.Panel>
  {/snippet}
</Tabs>
