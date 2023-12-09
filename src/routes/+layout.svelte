<script lang="ts">
	import '../app.postcss'
	import { storePopup } from '@skeletonlabs/skeleton'
	import {
    computePosition, autoUpdate, flip, shift, offset, arrow
  } from '@floating-ui/dom'
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
</script>

<slot />
