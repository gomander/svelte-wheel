<script lang="ts">
  import ColorsControl from '$lib/components/ColorsControl.svelte'
  import WheelConfig, { hubSizes } from '$lib/utils/WheelConfig'
  import { compressImage } from '$lib/utils/WheelPainter'

  export let config: WheelConfig

  const updateWheelImage = async (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const file = event.currentTarget.files?.[0]
    config.image = ''
    if (file) config.image = await compressImage(file)
  }
</script>

<div class="label">
  <span>Colors</span>

  <ColorsControl bind:colors={config.colors} />
</div>

<label class="label">
  <span>
    {config.type === 'color' ? 'Center image' : 'Background image'}
  </span>

  <input
    type="file"
    class="input"
    accept="image/*"
    on:input={updateWheelImage}
  />
</label>

{#if config.type === 'color'}
  <label class="label">
    <span>Hub size</span>

    <select
      class="select"
      bind:value={config.hubSize}
    >
      {#each Object.keys(hubSizes) as item}
        <option value={item}>{item}</option>
      {/each}
    </select>
  </label>
{/if}
