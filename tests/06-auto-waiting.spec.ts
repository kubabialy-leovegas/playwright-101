/**
 * LESSON 6: Auto-waiting (and why you should never "sleep")
 *
 * The products API on the shop page takes ~0.8s to respond.
 * A bad test would do:  await page.waitForTimeout(2000)  // DON'T
 *   - too short on a slow day  -> flaky test
 *   - too long on a fast day   -> slow test suite
 *
 * Instead, assert on what the USER waits for. expect() retries automatically.
 */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
});

test('loading message is shown, then replaced by products', async ({ page }) => {
  // Right after login the products are still loading.
  await expect(page.getByText('Loading products...')).toBeVisible();

  // No sleep needed: this waits until the products arrive.
  await expect(page.getByRole('listitem')).toHaveCount(5);
  await expect(page.getByText('Loading products...')).toBeHidden();
});

test('search filters the list as you type', async ({ page }) => {
  await page.getByPlaceholder('Search products').fill('key');

  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('listitem')).toContainText('Mechanical Keyboard');
});

test('category filter shows only matching products', async ({ page }) => {
  await page.getByLabel('Category').selectOption('home');

  await expect(page.getByRole('listitem')).toHaveText([
    /Coffee Mug/,
    /Desk Lamp/,
  ]);
});

test('empty search result shows a friendly message', async ({ page }) => {
  // Wait for the data first, otherwise we might see "Loading..." instead.
  await expect(page.getByRole('listitem')).toHaveCount(5);

  await page.getByPlaceholder('Search products').fill('banana');

  await expect(page.getByRole('listitem')).toHaveCount(0);
  await expect(page.getByText('No products found')).toBeVisible();
});
