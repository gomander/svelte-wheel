<script lang="ts">
  import { RangeSlider } from '@skeletonlabs/skeleton'

  let {
    title = $bindable(),
    description = $bindable(),
    spinTime = $bindable()
  }: {
    title: string,
    description: string,
    spinTime: number
  } = $props()

  const secondsFormat: Intl.NumberFormatOptions = {
    style: 'unit', unit: 'second', unitDisplay: 'long'
  }
</script>

<div class="flex flex-col gap-2">
  <label class="label">
    <span>Title</span>

    <input
      type="text"
      class="input"
      maxlength="50"
      bind:value={title}
    >
  </label>

  <label class="label">
    <span>Description</span>

    <textarea
      class="textarea resize-none"
      maxlength="200"
      bind:value={description}
    ></textarea>
  </label>

  <RangeSlider
    name="spinTime"
    label="Spin time"
    min={1}
    max={60}
    ticked
    bind:value={spinTime}
  >
    <div class="flex justify-between items-center">
      <span>Spin time</span>

      <span class="text-sm">
        {spinTime.toLocaleString('en', secondsFormat)}
      </span>
    </div>
  </RangeSlider>
</div>
