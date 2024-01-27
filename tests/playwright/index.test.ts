import { expect, test } from '@playwright/test'

test('Toolbar has page title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'SvelteWheel' })).toBeVisible()
})

test('Wheel canvas is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Wheel', { exact: true })).toBeVisible()
})

test('Wheel can be customized', async ({ page, isMobile }) => {
  await page.goto('/')
  const customizeButton = page.getByRole('menuitem', { name: 'Customize' })
  const customizeDialog = page.getByRole('dialog')
  const titleInput = customizeDialog.getByLabel('Title')
  const descriptionInput = customizeDialog.getByLabel('Description')
  const spinTimeValue = customizeDialog.getByText('10 seconds')
  const spinTimeSlider = customizeDialog.getByRole('slider', { name: 'Spin time' })
  const cancelButton = customizeDialog.getByRole('button', { name: 'Cancel' })
  const saveButton = customizeDialog.getByRole('button', { name: 'Save' })
  const title = page.getByRole('heading', { name: 'Wheel title' })
  const description = page.getByLabel('Wheel description')
  if (isMobile) {
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' })
    await mobileMenuButton.click()
  }
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

test('Login dialog opens when user who is not logged in clicks on open button', async ({ page, isMobile }) => {
  await page.goto('/')
  const openButton = page.getByRole('menuitem', { name: 'Open' })
  const openFromCloudButton = page.getByRole('button', { name: 'Open from the cloud' })
  const logInHeading = page.getByRole('heading', { name: 'Log in' })
  if (isMobile) {
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' })
    await mobileMenuButton.click()
  }
  await openButton.click()
  await openFromCloudButton.isVisible()
  await openFromCloudButton.click()
  await logInHeading.isVisible()
})
