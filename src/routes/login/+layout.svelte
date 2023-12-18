<div class="min-h-screen flex flex-col">
  <header class="px-4 py-2 bg-surface-200-700-token shadow-2xl">
    <a href="/" class="text-2xl flex items-center gap-2">
      <i class="fas fa-arrow-left" />
      <h1>SvelteWheel</h1>
    </a>
  </header>

  <div class="flex-grow flex flex-col justify-center items-center">
    <slot />
  </div>
</div>
