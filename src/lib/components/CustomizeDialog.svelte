<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton'
  import { wheelStore } from '$lib/stores/WheelStore'
  import { RangeSlider } from '@skeletonlabs/skeleton'

  const modalStore = getModalStore()

  const config = structuredClone($wheelStore.config)

  const save = () => {
    wheelStore.setConfig(config)
    modalStore.close()
  }

  const secondsFormat: Intl.NumberFormatOptions = {
    style: 'unit', unit: 'second', unitDisplay: 'long'
  }
</script>

{#if $modalStore[0]}
  <article class="card w-modal shadow-xl overflow-hidden">
    <header class="p-4 text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-palette" />
      <h1>Customize</h1>
    </header>

    <div class="px-4 flex flex-col gap-2">
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
    </div>

    <footer class="p-4 flex justify-end gap-2">
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
