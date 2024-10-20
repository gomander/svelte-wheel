<script lang="ts">
  import { Avatar, RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
  import { hubSizes, type WheelType, type HubSize } from '$lib/utils/WheelConfig'
  import { compressImage } from '$lib/utils/WheelPainter'
  import ColorsControl from '$lib/components/ColorsControl.svelte'

  let {
    type = $bindable(),
    image = $bindable(),
    colors = $bindable(),
    hubSize = $bindable()
  }: {
    type: WheelType,
    image: string,
    colors: string[],
    hubSize: HubSize
  } = $props()

  const updateWheelImage = async (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const file = event.currentTarget.files?.[0]
    image = ''
    if (file) image = await compressImage(file)
  }
</script>

<div>
  <span>Wheel background</span>

  <div>
    <RadioGroup>
      <RadioItem bind:group={type} name="color" value="color">
        Color
      </RadioItem>
      <RadioItem  bind:group={type} name="image" value="image">
        Image
      </RadioItem>
    </RadioGroup>
  </div>
</div>

<div class="label">
  <span>Colors</span>

  <ColorsControl bind:colors={colors} />
</div>

<label class="label">
  <span>
    {type === 'color' ? 'Center image' : 'Background image'}
  </span>

  <div class="flex flex-wrap gap-2">
    <div>
      <input
        type="file"
        class="input"
        accept="image/*"
        oninput={updateWheelImage}
      >
    </div>

    {#if image}
      <div class="flex gap-2">
        <Avatar
          rounded="rounded-full"
          src={image}
          width="w-20"
        />

        <button
          class="btn btn-icon variant-soft"
          onclick={() => (image = '')}
          title="Remove image"
          aria-label="Remove image"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    {/if}
  </div>
</label>

{#if type === 'color'}
  <label class="label">
    <span>Hub size</span>

    <select
      class="select"
      bind:value={hubSize}
    >
      {#each Object.keys(hubSizes) as item}
        <option value={item}>{item}</option>
      {/each}
    </select>
  </label>
{/if}
