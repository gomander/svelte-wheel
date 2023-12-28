<script lang="ts">
  import {
    getModalStore, RangeSlider, TabGroup, Tab
  } from '@skeletonlabs/skeleton'
  import { wheelStore } from '$lib/stores/WheelStore'
  import ColorsControl from '$lib/components/ColorsControl.svelte'
  import { confettiTypes } from '$lib/utils/ConfettiLauncher'
  import { duringSpinSounds, afterSpinSounds } from '$lib/utils/Audio'
  import { compressImage } from '$lib/utils/WheelPainter'

  const modalStore = getModalStore()

  const config = structuredClone($wheelStore.config)

	let openTab = 'basic'

  const save = () => {
    wheelStore.setConfig(config)
    modalStore.close()
  }

  const secondsFormat: Intl.NumberFormatOptions = {
    style: 'unit', unit: 'second', unitDisplay: 'long'
  }

  const updateWheelImage = async (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const file = event.currentTarget.files?.[0]
    config.image = ''
    if (file) config.image = await compressImage(file)
  }
</script>

{#if $modalStore[0]}
  <article class="p-4 card w-modal flex flex-col gap-4 shadow-xl">
    <header class="text-2xl font-semibold flex items-center gap-2">
      <i class="fas fa-palette" />
      <h1>Customize</h1>
    </header>

    <TabGroup
      class="flex-1 flex flex-col"
      regionPanel="flex-1 flex flex-col gap-4"
    >
      <Tab
        bind:group={openTab}
        name="basic"
        value="basic"
      >
        Basic
      </Tab>

      <Tab
        bind:group={openTab}
        name="appearance"
        value="appearance"
      >
        Appearance
      </Tab>

      <Tab
        bind:group={openTab}
        name="duringSpin"
        value="duringSpin"
      >
        During spin
      </Tab>

      <Tab
        bind:group={openTab}
        name="afterSpin"
        value="afterSpin"
      >
        After spin
      </Tab>

      <svelte:fragment slot="panel">
        {#if openTab === 'basic'}
          <div class="flex flex-col gap-2">
            <label class="label">
              <span>Title</span>

              <input
                type="text"
                class="input"
                maxlength="50"
                bind:value={config.title}
              />
            </label>

            <label class="label">
              <span>Description</span>

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
                <span>Spin time</span>

                <span class="text-sm">
                  {config.spinTime.toLocaleString('en', secondsFormat)}
                </span>
              </div>
            </RangeSlider>
          </div>
        {:else if openTab === 'appearance'}
          <div class="label">
            <span>Colors</span>

            <ColorsControl bind:colors={config.colors} />
          </div>

          <label class="label">
            <span>Center image</span>

            <input
              type="file"
              class="input"
              accept="image/*"
              on:input={updateWheelImage}
            />
          </label>
        {:else if openTab === 'duringSpin'}
          <label class="label">
            <span>Sound</span>

            <select
              class="select"
              bind:value={config.duringSpinSound}
            >
              <option value="">No sound</option>
              <option value="tick">Tick</option>
              {#each duringSpinSounds as item}
                <option value={item.file}>{item.name}</option>
              {/each}
            </select>
          </label>

          <label class="flex items-center space-x-2 w-fit">
            <input
              type="checkbox"
              bind:checked={config.indefiniteSpin}
              class="checkbox"
            />

            <span>Keep spinning until the wheel is clicked</span>
          </label>
        {:else if openTab === 'afterSpin'}
          <label class="label">
            <span>Sound</span>

            <select
              class="select"
              bind:value={config.afterSpinSound}
            >
              <option value="">No sound</option>
              {#each afterSpinSounds as item}
                <option value={item.file}>{item.name}</option>
              {/each}
            </select>
          </label>

          <label class="flex items-center space-x-2 w-fit">
            <input
              type="checkbox"
              bind:checked={config.displayWinnerDialog}
              class="checkbox"
            />

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
            />
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
        {/if}
      </svelte:fragment>
    </TabGroup>

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
