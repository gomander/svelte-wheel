import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	preprocess: [vitePreprocess()],
	vitePlugin: { inspector: true },
	kit: {
    adapter: adapter(),
    serviceWorker: { register: false }
  }
}
export default config
