import { expect, test } from '@playwright/test'

test('Buttons are disabled when the wheel is spun', async ({ page, isMobile }) => {
  await page.goto('/')
  const sortButton = page.getByRole('button', { name: 'Sort' })
  const shuffleButton = page.getByRole('button', { name: 'Shuffle' })
  const entriesTextbox = page.getByRole('textbox', { name: 'Entries' })
  const resetButton = page.getByRole('button', { name: 'Reset' })
  const newButton = page.getByRole('menuitem', { name: 'New' })
  const openButton = page.getByRole('menuitem', { name: 'Open' })
  const saveButton = page.getByRole('menuitem', { name: 'Save' })
  const customizeButton = page.getByRole('menuitem', { name: 'Customize' })
  const shareButton = page.getByRole('menuitem', { name: 'Share' })
  const entriesTab = page.getByRole('tab', { name: 'Entries' })
  const resultsTab = page.getByRole('tab', { name: 'Results' })
  const wheel = page.getByLabel('Wheel', { exact: true })
  if (isMobile) {
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' })
    await mobileMenuButton.click()
  }
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
  if (isMobile) {
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' })
    await mobileMenuButton.click()
  }
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

test('Wheel can be spun and a result is generated', async ({ page, isMobile }) => {
  await page.goto('/')
  const wheel = page.getByLabel('Wheel', { exact: true })
  const resultDialog = page.getByRole('dialog', { name: 'We have a winner!' })
  const closeButton = resultDialog.getByRole('button', { name: 'Close' })
  const removeButton = resultDialog.getByRole('button', { name: 'Remove' })
  const resultsTab = page.getByRole('tab', { name: 'Results' })
  const resultsTextbox = page.getByRole('textbox', { name: 'Results' })
  await wheel.click()
  await expect(resultDialog).toBeVisible({ timeout: 12000 })
  const result = await resultDialog.getByLabel('Winner').textContent()
  expect(result).not.toBeNull()
  await Promise.all([
    expect(closeButton).toBeVisible(),
    expect(removeButton).toBeVisible()
  ])
  await removeButton.click()
  await expect(resultDialog).not.toBeVisible()
  await resultsTab.click()
  await Promise.all([
    expect(resultsTextbox).toBeVisible(),
    expect(resultsTextbox).toHaveValue(result as string)
  ])
})
