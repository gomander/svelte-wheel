<script lang="ts">
  import { page } from '$app/stores'
</script>

<main class="min-h-screen flex flex-col justify-center items-center gap-4 text-3xl">
  <h1 class="h1">{$page.status}</h1>
  <p>{$page.error?.message || 'There was an error loading the page'}</p>
  <a href="/" class="btn variant-filled-primary">Go home</a>
</main>
