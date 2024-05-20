<script lang="ts">
  import { Avatar, RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
  import WheelConfig, { hubSizes } from '$lib/utils/WheelConfig'
  import { compressImage } from '$lib/utils/WheelPainter'
  import ColorsControl from '$lib/components/ColorsControl.svelte'

  export let config: WheelConfig

  const updateWheelImage = async (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const file = event.currentTarget.files?.[0]
    config.image = ''
    if (file) config.image = await compressImage(file)
  }
</script>

<div>
  <span>Wheel background</span>

  <div>
    <RadioGroup>
      <RadioItem bind:group={config.type} name="color" value="color">
        Color
      </RadioItem>
      <RadioItem  bind:group={config.type} name="image" value="image">
        Image
      </RadioItem>
    </RadioGroup>
  </div>
</div>

<div class="label">
  <span>Colors</span>

  <ColorsControl bind:colors={config.colors} />
</div>

<label class="label">
  <span>
    {config.type === 'color' ? 'Center image' : 'Background image'}
  </span>

  <div class="flex flex-wrap gap-2">
    <div>
      <input
        type="file"
        class="input"
        accept="image/*"
        on:input={updateWheelImage}
      >
    </div>

    {#if config.image}
      <div class="flex gap-2">
        <Avatar
          rounded="rounded-full"
          src={config.image}
          width="w-20"
        />

        <button
          class="btn btn-icon variant-soft"
          on:click={() => (config.image = '')}
          title="Remove image"
          aria-label="Remove image"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    {/if}
  </div>
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
