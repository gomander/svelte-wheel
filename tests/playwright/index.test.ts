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

test('Buttons are disabled when the wheel is spun', async ({ page }) => {
  await page.goto('/')
  const sortButton = page.getByRole('button', { name: 'Sort' })
  const shuffleButton = page.getByRole('button', { name: 'Shuffle' })
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  const resetButton = page.getByRole('button', { name: 'Reset' })
  const newButton = page.getByRole('button', { name: 'New' })
  const openButton = page.getByRole('button', { name: 'Open' })
  const saveButton = page.getByRole('button', { name: 'Save' })
  const customizeButton = page.getByRole('button', { name: 'Customize' })
  const shareButton = page.getByRole('button', { name: 'Share' })
  const entriesTab = page.getByRole('tab', { name: 'Entries' })
  const resultsTab = page.getByRole('tab', { name: 'Results' })
  const wheel = page.getByLabel('Wheel', { exact: true })
  await Promise.all([
    expect(entriesTab).toBeVisible(),
    expect(resultsTab).toBeVisible(),
    expect(sortButton).not.toBeDisabled(),
    expect(shuffleButton).not.toBeDisabled(),
    expect(entriesTextbox).not.toBeDisabled(),
    expect(newButton).not.toBeDisabled(),
    expect(openButton).not.toBeDisabled(),
    expect(saveButton).not.toBeDisabled(),
    expect(customizeButton).not.toBeDisabled(),
    expect(shareButton).not.toBeDisabled()
  ])
  await resultsTab.click()
  await expect(resetButton).not.toBeDisabled()
  await wheel.click()
  await expect(resetButton).toBeDisabled()
  await entriesTab.click()
  await Promise.all([
    expect(sortButton).toBeDisabled(),
    expect(shuffleButton).toBeDisabled(),
    expect(entriesTextbox).toBeDisabled(),
    expect(newButton).toBeDisabled(),
    expect(openButton).toBeDisabled(),
    expect(saveButton).toBeDisabled(),
    expect(customizeButton).toBeDisabled(),
    expect(shareButton).toBeDisabled()
  ])
})

test('Wheel can be customized', async ({ page }) => {
  await page.goto('/')
  const customizeButton = page.getByRole('button', { name: 'Customize' })
  const customizeDialog = page.getByRole('dialog')
  const titleInput = customizeDialog.getByLabel('Title')
  const descriptionInput = customizeDialog.getByLabel('Description')
  const spinTimeValue = customizeDialog.getByText('10 seconds')
  const spinTimeSlider = customizeDialog.getByRole('slider', { name: 'Spin time' })
  const newSpinTimeValue = customizeDialog.getByText('1 second')
  const cancelButton = customizeDialog.getByRole('button', { name: 'Cancel' })
  const saveButton = customizeDialog.getByRole('button', { name: 'Save' })
  const title = page.getByRole('heading', { name: 'Wheel title' })
  const description = page.getByLabel('Wheel description')
  await customizeButton.click()
  await Promise.all([
    expect(customizeDialog).toBeVisible(),
    expect(titleInput).toBeVisible(),
    expect(descriptionInput).toBeVisible(),
    expect(spinTimeValue).toBeVisible(),
    expect(spinTimeSlider).toBeVisible(),
    expect(cancelButton).toBeVisible(),
    expect(saveButton).toBeVisible()
  ])
  await titleInput.fill('My Custom Wheel')
  await expect(titleInput).toHaveValue('My Custom Wheel')
  await descriptionInput.fill('My custom description')
  await expect(descriptionInput).toHaveValue('My custom description')
  await spinTimeSlider.click({ force: true, position: { x: 0, y: 0 } })
  await expect(newSpinTimeValue).toBeVisible()
  await saveButton.click()
  await Promise.all([
    expect(customizeDialog).not.toBeVisible(),
    expect(title).toBeVisible(),
    expect(title).toHaveText('My Custom Wheel'),
    expect(description).toBeVisible(),
    expect(description).toHaveText('My custom description')
  ])
  expect(await page.title()).toBe('My Custom Wheel - Svelte Wheel')
})

test('Wheel can be spun and a result is generated', async ({ page }) => {
  await page.goto('/')
  const customizeButton = page.getByRole('button', { name: 'Customize' })
  await customizeButton.click()
  const customizeDialog = page.getByRole('dialog')
  const spinTimeSlider = customizeDialog.getByRole('slider', { name: 'Spin time' })
  await spinTimeSlider.click({ force: true, position: { x: 0, y: 0 } })
  const saveButton = customizeDialog.getByRole('button', { name: 'Save' })
  await saveButton.click()
  const wheel = page.getByLabel('Wheel', { exact: true })
  await wheel.click()
  const resultDialog = page.getByRole('dialog', { name: 'We have a winner!' })
  await expect(resultDialog).toBeVisible()
  const result = await resultDialog.getByLabel('Winner').textContent()
  expect(result).not.toBeNull()
  const closeButton = resultDialog.getByRole('button', { name: 'Close' })
  await expect(closeButton).toBeVisible()
  const removeButton = resultDialog.getByRole('button', { name: 'Remove' })
  await expect(removeButton).toBeVisible()
  await removeButton.click()
  await expect(resultDialog).not.toBeVisible()
  const resultsTab = page.getByRole('tab', { name: 'Results' })
  await resultsTab.click()
  const resultsTextbox = page.getByRole('textbox', { name: 'Results' })
  await expect(resultsTextbox).toBeVisible()
  await expect(resultsTextbox).toHaveValue(result as string)
})
