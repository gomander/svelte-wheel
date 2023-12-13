<script lang="ts">
  import { wheelStore } from '$lib/stores/WheelStore'

  const sortWinners = () => {
    const winners = [...$wheelStore.winners]
    winners.sort((a, b) => a.text.localeCompare(b.text))
    wheelStore.setWinners(winners)
  }

  const resetEntries = () => {
    const combined = [...$wheelStore.entries, ...$wheelStore.winners]
    const ids: string[] = []
    const entries = combined.filter(entry => {
      if (ids.includes(entry.id)) return false
      ids.push(entry.id)
      return true
    })
    wheelStore.setEntries(entries)
    wheelStore.setWinners([])
  }

  const clearWinners = () => wheelStore.setWinners([])
</script>

<div class="flex gap-2 sm:gap-4">
  <button
    class="btn variant-filled flex-1"
    on:click={sortWinners}
  >
    <i class="fas fa-arrow-down-a-z" />
    <span>Sort</span>
  </button>

  <button
    class="btn variant-filled flex-1"
    on:click={resetEntries}
  >
    <i class="fas fa-rotate-left" />
    <span>Reset</span>
  </button>

  <button
    class="btn variant-filled flex-1"
    on:click={clearWinners}
  >
    <i class="fas fa-x" />
    <span>Clear</span>
  </button>
</div>
