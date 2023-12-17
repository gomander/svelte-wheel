<script lang="ts">
  import { wheelStore } from '$lib/stores/WheelStore'

  const sortEntries = () => {
    const entries = [...$wheelStore.entries]
    entries.sort((a, b) => a.text.localeCompare(b.text))
    wheelStore.setEntries(entries)
  }

  const shuffleEntries = () => {
    const array = [...$wheelStore.entries]
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    wheelStore.setEntries(array)
  }
</script>

<div class="flex gap-2 sm:gap-4">
  <button
    class="btn variant-filled flex-1"
    on:click={sortEntries}
    aria-label="Sort"
  >
    <i class="fas fa-arrow-down-a-z" />
    <span>Sort</span>
  </button>

  <button
    class="btn variant-filled flex-1"
    on:click={shuffleEntries}
    aria-label="Shuffle"
  >
    <i class="fas fa-shuffle" />
    <span>Shuffle</span>
  </button>
</div>
