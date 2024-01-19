/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [
    sveltekit(),
    purgeCss(),
    SvelteKitPWA({
      includeAssets: [
        'favicon.ico',
        'images/icons/favicon.svg',
        'images/icons/apple-touch-icon-180x180.png',
        'Quicksand-VariableFont_wght.ttf',
        'audio/*.mp3'
      ],
      manifest: {
        name: 'Svelte Wheel',
        short_name: 'SvelteWheel',
        description: 'Enter texts onto the wheel and spin for a random result!',
        theme_color: '#022a4f',
        icons: [
          {
            src: 'images/icons/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'images/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'images/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'images/icons/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'monochrome'
          }
        ],
        screenshots: [
          {
            src: 'images/screenshots/mobile.png',
            sizes: '1080x2340',
            type: 'image/png'
          },
          {
            src: 'images/screenshots/desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/\w\w\w\-\w\w\w$/],
        runtimeCaching: [{
          urlPattern: ({ url, sameOrigin }) => {
            return sameOrigin && url.pathname.match(/^\/\w\w\w\-\w\w\w$/)
          },
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'ssr-pages-cache',
            cacheableResponse: { statuses: [200] }
          }
        }]
      }
    })
  ],
  test: { dir: 'tests/unit' }
})
