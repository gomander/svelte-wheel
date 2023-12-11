<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton'
  import { getTextColor } from '$lib/utils/FontPicker'

  const modalStore = getModalStore()
</script>

{#if $modalStore[0]}
  <article class="card w-modal shadow-xl overflow-hidden">
    <header
      class="p-4 text-2xl font-semibold"
      style={
        $modalStore[0].meta.color
          ? `
            background-color: ${$modalStore[0].meta.color};
            color: ${getTextColor($modalStore[0].meta.color)}
          `
          : ''
      }
    >
      {$modalStore[0].title}
    </header>

    <div class="p-4 h1">{$modalStore[0].body}</div>

    <footer class="p-4 flex justify-end gap-2 md:gap-4">
      <button
        class="btn variant-soft"
        on:click={modalStore.close}
      >
        Close
      </button>
    </footer>
  </article>
{/if}
