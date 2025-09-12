import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check if the page title is correct
  await expect(page).toHaveTitle(/Oreliya/);

  // Check if main elements are present
  await expect(page.locator('text=Explore Our Collections')).toBeVisible();
  await expect(page.locator('text=Coming Soon')).toBeVisible();
  await expect(page.locator('text=Start Custom Design')).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // Click on Custom Design link
  await page.locator('text=Custom Design').click();

  // Should navigate to customization page
  await expect(page).toHaveURL(/.*customization/);
});
