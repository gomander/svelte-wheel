<script>
  import Toolbar from '$lib/components/Toolbar.svelte'
  import Wheel from '$lib/components/Wheel.svelte'
</script>

<div class="min-h-screen flex flex-col">
  <Toolbar />

  <div class="flex-grow flex flex-col xl:grid grid-cols-4">
    <div class="col-span-1 pb-0 p-4 xl:pb-4 xl:pr-0 flex flex-col">
      <h2 class="text-3xl">Title</h2>
      <p class="text-lg">Description</p>
    </div>

    <div class="col-span-2 flex-1 flex flex-col justify-center items-center">
      <Wheel />
    </div>

    <div class="col-span-1 pt-0 p-4 xl:pt-4 xl:pl-0 flex flex-col">
      Editor
    </div>
  </div>
</div>
