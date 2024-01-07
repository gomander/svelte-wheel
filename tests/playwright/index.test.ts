import { expect, test } from '@playwright/test'

test('Toolbar has page title', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByRole('heading', { name: 'SvelteWheel' })).toBeVisible()
})

test('Wheel canvas is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Wheel', { exact: true })).toBeVisible()
})

test('Entries textbox has default entries', async ({ page }) => {
  await page.goto('/')
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  await expect(entriesTextbox).toBeVisible()
  await expect(entriesTextbox).toHaveValue(
    'Ali\nBeatriz\nCharles\nDiya\nEric\nFatima\nGabriel\nHanna'
  )
})

test('Shuffle and Sort buttons change entry order', async ({ page }) => {
  await page.goto('/')
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  const shuffleButton = page.getByRole('button', { name: 'Shuffle' })
  await shuffleButton.click()
  await expect(entriesTextbox).not.toHaveValue(
    'Ali\nBeatriz\nCharles\nDiya\nEric\nFatima\nGabriel\nHanna'
  )
  const sortButton = page.getByRole('button', { name: 'Sort' })
  await sortButton.click()
  await expect(entriesTextbox).toHaveValue(
    'Ali\nBeatriz\nCharles\nDiya\nEric\nFatima\nGabriel\nHanna'
  )
})

test('New button resets wheel', async ({ page }) => {
  await page.goto('/')
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  const shuffleButton = page.getByRole('button', { name: 'Shuffle' })
  await shuffleButton.click()
  const newButton = page.getByRole('button', { name: 'New' })
  await newButton.click()
  await expect(entriesTextbox).toHaveValue(
    'Ali\nBeatriz\nCharles\nDiya\nEric\nFatima\nGabriel\nHanna'
  )
})
