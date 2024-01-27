import { expect, test } from '@playwright/test'

const defaultEntries = 'Ali\nBeatriz\nCharles\nDiya\nEric\nFatima\nGabriel\nHanna'

test('Entries textbox has default entries', async ({ page }) => {
  await page.goto('/')
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  await expect(entriesTextbox).toBeVisible()
  await expect(entriesTextbox).toHaveValue(defaultEntries)
})

test('Shuffle and Sort buttons change entry order', async ({ page }) => {
  await page.goto('/')
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  const shuffleButton = page.getByRole('button', { name: 'Shuffle' })
  const sortButton = page.getByRole('button', { name: 'Sort' })
  await shuffleButton.click()
  await expect(entriesTextbox).not.toHaveValue(defaultEntries)
  await sortButton.click()
  await expect(entriesTextbox).toHaveValue(defaultEntries)
})

test('New button resets wheel', async ({ page, isMobile }) => {
  await page.goto('/')
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  const shuffleButton = page.getByRole('button', { name: 'Shuffle' })
  const newButton = page.getByRole('menuitem', { name: 'New' })
  await shuffleButton.click()
  if (isMobile) {
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' })
    await mobileMenuButton.click()
  }
  await newButton.click()
  await expect(entriesTextbox).toHaveValue(defaultEntries)
})
