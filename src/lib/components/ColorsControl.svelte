<script lang="ts">
  import { flip } from 'svelte/animate'
  import { dndzone } from 'svelte-dnd-action'

  export let colors: string[] = []

  let colorsArray = colors.map((hex, i) => ({ name: hex, id: i }))
  $: colors = colorsArray.map(item => item.name)

  const addColor = () => (
    colorsArray = [...colorsArray, { name: '#000000', id: colorsArray.length }]
  )
  const deleteColor = (id: number) => {
    if (colorsArray.length === 1) return
    colorsArray = colorsArray.filter(item => item.id !== id)
  }

  const handleSortColors = (e: CustomEvent<DndEvent>) => (
    colorsArray = e.detail.items as { id: number, name: string }[]
  )
</script>

<div class="flex items-center gap-2">
  <div
    use:dndzone={{ items: colorsArray, flipDurationMs: 100 }}
    on:consider={handleSortColors}
    on:finalize={handleSortColors}
    class="p-2 flex flex-wrap gap-2 w-fit rounded-3xl variant-soft"
  >
    {#each colorsArray as item(item.id)}
      <div
        animate:flip={{ duration: 100 }}
        class="flex flex-col"
        aria-label="Use enter and the arrow keys to reorder this color"
      >
        <div
          class="h-6 flex justify-center items-center bg-surface-50-900-token rounded-t-full"
          title="Drag to reorder"
        >
          <i class="fas fa-grip text-surface-300-600-token" />
        </div>

        <input
          type="color"
          bind:value={item.name}
          class="w-8 h-8 cursor-pointer"
          style="background-color: {item.name}"
          title="Edit color"
          aria-label="Edit color"
        />

        <button
          on:click={() => deleteColor(item.id)}
          class="h-6 bg-surface-50-900-token rounded-b-full"
          title="Delete color"
          aria-label="Delete color"
        >
          <i class="fas fa-times text-surface-400-500-token" />
        </button>
      </div>
    {/each}
  </div>

  <button
    class="btn btn-icon-sm variant-filled"
    on:click={addColor}
    title="Add color"
    aria-label="Add color"
  >
    <i class="fas fa-plus" />
  </button>
</div>
