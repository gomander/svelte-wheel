<script lang="ts">
  import wheelStore from '$lib/stores/WheelStore'
  import busyStore from '$lib/stores/BusyStore.svelte'

  const sortWinners = () => {
    wheelStore.winners = wheelStore.winners.toSorted((a, b) => a.text.localeCompare(b.text))
  }

  const resetEntries = () => {
    const combined = [...wheelStore.entries, ...wheelStore.winners]
    const ids: string[] = []
    const entries = combined.filter(entry => {
      if (ids.includes(entry.id)) return false
      ids.push(entry.id)
      return true
    })
    wheelStore.entries = entries
    wheelStore.winners = []
  }

  const clearWinners = () => wheelStore.winners = []
</script>

<div class="flex gap-2 sm:gap-4">
  <button
    class="btn variant-filled flex-1"
    onclick={sortWinners}
    aria-label="Sort"
  >
    <i class="fas fa-arrow-down-a-z"></i>
    <span>Sort</span>
  </button>

  <button
    class="btn variant-filled flex-1"
    onclick={resetEntries}
    disabled={busyStore.spinning}
    aria-label="Reset"
  >
    <i class="fas fa-rotate-left"></i>
    <span>Reset</span>
  </button>

  <button
    class="btn variant-filled flex-1"
    onclick={clearWinners}
    aria-label="Clear"
  >
    <i class="fas fa-x"></i>
    <span>Clear</span>
  </button>
</div>
