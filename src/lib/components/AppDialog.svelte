<script lang="ts">
  import type { Snippet } from 'svelte'

  export function open() {
    dialog.showModal()
  }

  export function close() {
    dialog.close()
  }

  let { children }: { children: Snippet } = $props()

  let dialog: HTMLDialogElement = $state(null!)

  function handleClick(e: MouseEvent) {
    const r = dialog.getBoundingClientRect()
    if (
      e.clientX < r.left || e.clientX > r.right ||
      e.clientY < r.top || e.clientY > r.bottom
    ) close()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
</script>

<dialog
  bind:this={dialog}
  onclick={handleClick}
  onkeydown={handleKeydown}
  class="preset-filled-surface-50-950 card shadow-xl"
>
  {@render children()}
</dialog>

<style>
  dialog {
    position: fixed;
    inset: 0;
    max-width: min(calc(100% - 32px), calc(65em + 32px));
    max-height: calc(100% - 32px);
    margin: auto;
    opacity: 0;
    scale: 20%;
    transition: scale 0.2s ease-in-out,
                opacity 0.2s ease-in-out,
                overlay 0.2s allow-discrete,
                display 0.2s allow-discrete;

    &::backdrop {
      background-color: #000;
      opacity: 0;
      transition: opacity 0.2s ease-in-out,
                  overlay 0.2s allow-discrete,
                  display 0.2s allow-discrete;
    }

    &[open] {
      opacity: 1;
      scale: 1;

      &::backdrop {
        opacity: 50%;

        @starting-style {
          opacity: 0;
        }
      }

      @starting-style {
        opacity: 0;
        scale: 20%;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    dialog {
      transition: none;
    }
  }
</style>
