<script lang="ts">
  import { duringSpinSounds } from '$lib/utils/Audio'

  let {
    duringSpinSound = $bindable(),
    indefiniteSpin = $bindable()
  }: {
    duringSpinSound: string
    indefiniteSpin: boolean
  } = $props()
</script>

<label class="label">
  <span>Sound</span>

  <select
    class="select"
    bind:value={duringSpinSound}
  >
    <option value="">No sound</option>
    <option value="tick">Tick</option>
    {#each duringSpinSounds as item (item.file)}
      <option value={item.file}>{item.name}</option>
    {/each}
  </select>
</label>

<label class="flex items-center space-x-2 w-fit">
  <input
    type="checkbox"
    bind:checked={indefiniteSpin}
    class="checkbox"
  >

  <span>Keep spinning until the wheel is clicked</span>
</label>
