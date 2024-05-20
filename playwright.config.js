// @ts-check
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173
  },
  testDir: 'tests/playwright',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  retries: 2,
  projects: [
    {
      name: 'Desktop Chromium',
      use: devices['Desktop Chrome']
    },
    {
      name: 'Desktop Safari',
      use: devices['Desktop Safari']
    },
    {
      name: 'Desktop Firefox',
      use: devices['Desktop Firefox']
    },
    {
      name: 'Mobile Chrome',
      use: devices['Pixel 5']
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 12']
    }
  ]
})
