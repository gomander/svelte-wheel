<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import busyStore from '$lib/stores/BusyStore'

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
    aria-label="Sort"
  >
    <i class="fas fa-arrow-down-a-z"></i>
    <span>Sort</span>
  </button>

  <button
    class="btn variant-filled flex-1"
    on:click={resetEntries}
    disabled={$busyStore.spinning}
    aria-label="Reset"
  >
    <i class="fas fa-rotate-left"></i>
    <span>Reset</span>
  </button>

  <button
    class="btn variant-filled flex-1"
    on:click={clearWinners}
    aria-label="Clear"
  >
    <i class="fas fa-x"></i>
    <span>Clear</span>
  </button>
</div>
