<script lang="ts">
  import { afterSpinSounds } from '$lib/utils/Audio'
  import { confettiTypes, type ConfettiType } from '$lib/utils/WheelConfig'

  let {
    afterSpinSound = $bindable(),
    displayWinnerDialog = $bindable(),
    winnerMessage = $bindable(),
    confetti = $bindable()
  }: {
    afterSpinSound: string
    displayWinnerDialog: boolean
    winnerMessage: string
    confetti: ConfettiType
  } = $props()
</script>

<label class="label">
  <span>Sound</span>

  <select
    class="select"
    bind:value={afterSpinSound}
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
    bind:checked={displayWinnerDialog}
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
    bind:value={winnerMessage}
    placeholder="We have a winner!"
    disabled={!displayWinnerDialog}
  >
</label>

<label class="label">
  <span>Confetti</span>

  <select
    class="select"
    bind:value={confetti}
  >
    {#each confettiTypes as item}
      <option value={item}>{item}</option>
    {/each}
  </select>
</label>
