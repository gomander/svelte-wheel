<script lang="ts">
  import { flip } from 'svelte/animate'
  import { getModalStore, RangeSlider } from '@skeletonlabs/skeleton'
  import { dndzone } from 'svelte-dnd-action'
  import { wheelStore } from '$lib/stores/WheelStore'

  const modalStore = getModalStore()

  const config = structuredClone($wheelStore.config)

  const save = () => {
    config.colors = colorsArray.map(({ name }) => name)
    wheelStore.setConfig(config)
    modalStore.close()
  }

  const secondsFormat: Intl.NumberFormatOptions = {
    style: 'unit', unit: 'second', unitDisplay: 'long'
  }

  let colorsArray = config.colors.map((hex, i) => ({ name: hex, id: i }))
  const addColor = () => (
    colorsArray = [...colorsArray, { name: '#000000', id: colorsArray.length }]
  )

  const handleSortColors = (e: CustomEvent<DndEvent>) => (
    colorsArray = e.detail.items as { id: number, name: string }[]
  )
</script>

{#if $modalStore[0]}
  <article class="p-4 card w-modal flex flex-col gap-4 shadow-xl">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-palette" />
      <h1>Customize</h1>
    </header>

    <div class="flex flex-col gap-2">
      <label class="label">
        Title

        <input
          type="text"
          class="input"
          maxlength="50"
          bind:value={config.title}
        />
      </label>

      <label class="label">
        Description

        <textarea
          class="textarea resize-none"
          maxlength="200"
          bind:value={config.description}
        />
      </label>

      <RangeSlider
        name="spinTime"
        label="Spin time"
        min={1}
        max={60}
        ticked
        bind:value={config.spinTime}
      >
        <div class="flex justify-between items-center">
          <div>Spin time</div>

          <div class="text-sm">
            {config.spinTime.toLocaleString('en', secondsFormat)}
          </div>
        </div>
      </RangeSlider>

      <div class="label">
        Colors

        <div class="flex items-center gap-2">
          <div
            use:dndzone={{ items: colorsArray, flipDurationMs: 100 }}
            on:consider={handleSortColors}
            on:finalize={handleSortColors}
            class="p-2 flex flex-wrap gap-2 w-fit rounded-full variant-soft"
          >
            {#each colorsArray as item(item.id)}
              <input
                type="color"
                bind:value={item.name}
                animate:flip={{ duration: 100 }}
                class="rounded-full w-8 h-8"
                style="background-color: {item.name}"
                title="Edit color"
                aria-label="Edit color"
              />
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
      </div>
    </div>

    <footer class="flex justify-end gap-2">
      <button
        class="btn variant-soft"
        on:click={modalStore.close}
      >
        Cancel
      </button>

      <button
        class="btn variant-filled-primary"
        on:click={save}
      >
        Save
      </button>
    </footer>
  </article>
{/if}

<style lang="postcss">
  input[type="color"]::-moz-color-swatch {
    @apply rounded-full;
  }
  input[type="color"]::-webkit-color-swatch {
    @apply rounded-full;
  }
  input[type="color"]::-webkit-color-swatch-wrapper {
    @apply rounded-full;
    padding: 0;
  }
</style>
