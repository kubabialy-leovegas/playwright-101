/**
 * LESSON 1: Your first test
 *
 * Every Playwright test:
 *   1. imports `test` and `expect`
 *   2. gets a fresh, isolated browser `page` (like a brand new incognito tab)
 *   3. does something (goto, click, fill...)
 *   4. checks the result with `expect(...)`
 *
 * Run only this file:   npx playwright test 01
 * Watch it in a browser: npx playwright test 01 --headed
 */
import { test, expect } from '@playwright/test';

test('login page opens and has the right title', async ({ page }) => {
  // baseURL is set in playwright.config.ts, so '/' means http://localhost:3000/
  await page.goto('/');

  // Check the browser tab title.
  await expect(page).toHaveTitle('Demo Shop - Login');

  // Check that the main heading is visible to the user.
  await expect(page.getByRole('heading', { name: 'Welcome to Demo Shop' })).toBeVisible();
});

test('user can navigate to the contact page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Contact us' }).click();

  // Check the URL changed (a regex means "contains").
  await expect(page).toHaveURL(/contact/);
  await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible();
});
