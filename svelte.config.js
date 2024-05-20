import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte'],
  preprocess: [vitePreprocess()],
  vitePlugin: { inspector: true },
  kit: {
    adapter: adapter(),
    serviceWorker: { register: false },
    paths: { relative: false },
    typescript: {
      config(config) {
        config.include.push('../*.config.js')
      }
    }
  }
}
