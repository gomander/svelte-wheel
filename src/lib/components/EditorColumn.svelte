<script lang="ts">
  import { Tabs } from "@skeletonlabs/skeleton-svelte";
  import wheelStore from "$lib/stores/WheelStore";
  import EditorButtons from "$lib/components/EditorButtons.svelte";
  import EntriesTextbox from "$lib/components/EntriesTextbox.svelte";
  import ResultsButtons from "$lib/components/ResultsButtons.svelte";
  import ResultsTextbox from "$lib/components/ResultsTextbox.svelte";
</script>

<Tabs defaultValue="editor" class="grow flex flex-col">
  <Tabs.List>
    <Tabs.Trigger value="editor">
      <div class="flex items-center gap-2">
        <span id="entries-label">Entries</span>
        <span class="badge preset-filled">{wheelStore.entries.length}</span>
      </div>
    </Tabs.Trigger>
    <Tabs.Trigger value="results">
      <div class="flex items-center gap-2">
        <span id="results-label">Results</span>
        <span class="badge preset-filled">{wheelStore.winners.length}</span>
      </div>
    </Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="editor" class="grow flex flex-col gap-4">
    <EditorButtons />
    <EntriesTextbox />
  </Tabs.Content>
  <Tabs.Content value="results" class="grow flex flex-col gap-4">
    <ResultsButtons />
    <ResultsTextbox />
  </Tabs.Content>
</Tabs>
