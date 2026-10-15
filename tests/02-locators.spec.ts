/**
 * LESSON 2: Locators - how to find elements
 *
 * A locator is a "recipe" for finding an element. It is evaluated lazily,
 * right when you act on it, so it always finds the CURRENT state of the page.
 *
 * Prefer locators that describe the page the way a USER sees it.
 * Recommended order:
 *   1. getByRole        - button, link, heading, textbox, checkbox...  (best!)
 *   2. getByLabel       - form fields by their label text
 *   3. getByPlaceholder - inputs by placeholder
 *   4. getByText        - non-interactive text
 *   5. getByTestId      - data-testid="..." when nothing above fits
 *   6. page.locator('css')  - last resort; breaks when markup/styling changes
 *
 * Tip: run `npm run codegen` and click around; Playwright suggests locators for you.
 */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('getByRole: find elements by their role and accessible name', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome to Demo Shop');
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  await expect(page.getByRole('checkbox', { name: 'Remember me' })).not.toBeChecked();
});

test('getByLabel: find form fields by their label', async ({ page }) => {
  await page.getByLabel('Email').fill('qa@example.com');
  await expect(page.getByLabel('Email')).toHaveValue('qa@example.com');
});

test('getByPlaceholder and getByText', async ({ page }) => {
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  await expect(page.getByText('to sign in')).toBeVisible(); // partial match by default
});

test('getByTestId: for elements without a good role or text', async ({ page }) => {
  // Log in quickly so we can reach the shop page.
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // <span data-testid="cart-count">0</span>
  await expect(page.getByTestId('cart-count')).toHaveText('0');
});

test('CSS locator works, but is fragile', async ({ page }) => {
  // This works today, but breaks if a developer renames the id or changes the tag.
  await expect(page.locator('#login-form button[type=submit]')).toHaveText('Sign in');
});
