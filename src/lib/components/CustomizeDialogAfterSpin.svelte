<script lang="ts">
  import type WheelConfig from '$lib/utils/WheelConfig'
  import { afterSpinSounds } from '$lib/utils/Audio'
  import { confettiTypes } from '$lib/utils/WheelConfig'

  let { config = $bindable() }: { config: WheelConfig } = $props()
</script>

<label class="label">
  <span>Sound</span>

  <select
    class="select"
    bind:value={config.afterSpinSound}
  >
    <option value="">No sound</option>
    {#each afterSpinSounds as item (item.file)}
      <option value={item.file}>{item.name}</option>
    {/each}
  </select>
</label>

<label class="flex items-center space-x-2 w-fit">
  <input
    type="checkbox"
    bind:checked={config.displayWinnerDialog}
    class="checkbox"
  >

  <span>Display winner dialog</span>
</label>

<label class="label">
  <span>Winner message</span>

  <input
    type="text"
    class="input"
    maxlength="50"
    bind:value={config.winnerMessage}
    placeholder="We have a winner!"
    disabled={!config.displayWinnerDialog}
  >
</label>

<label class="label">
  <span>Confetti</span>

  <select
    class="select"
    bind:value={config.confetti}
  >
    {#each confettiTypes as item}
      <option value={item}>{item}</option>
    {/each}
  </select>
</label>
