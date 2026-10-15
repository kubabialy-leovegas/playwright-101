/**
 * LESSON 4: Assertions
 *
 * `await expect(locator).toXxx()` is a "web-first" assertion: it RETRIES
 * until the condition is true or the timeout (5s by default) runs out.
 * That is why we almost never need waits.
 *
 * Common ones:
 *   toBeVisible / toBeHidden      toHaveText / toContainText
 *   toBeEnabled / toBeDisabled    toHaveValue
 *   toBeChecked                   toHaveCount
 *   toHaveURL / toHaveTitle       toHaveAttribute
 *   .not.toXxx()  - the opposite
 */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
});

test('product list shows all 5 products', async ({ page }) => {
  const products = page.getByRole('listitem');
  await expect(products).toHaveCount(5);
  await expect(products.first()).toContainText('Wireless Mouse');
});

test('logged in user email is shown', async ({ page }) => {
  await expect(page.getByText('qa@example.com')).toBeVisible();
});

test('adding a product updates the cart', async ({ page }) => {
  // filter() narrows a list down to the one row we care about.
  const mugRow = page.getByRole('listitem').filter({ hasText: 'Coffee Mug' });

  await mugRow.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.getByTestId('cart-count')).toHaveText('1');
  await expect(mugRow.getByRole('button')).toHaveText('Added');
  await expect(mugRow.getByRole('button')).toBeDisabled();
});

test('soft assertions: report all failures, not just the first', async ({ page }) => {
  // expect.soft does not stop the test; all failures are listed at the end.
  // Useful when checking many independent things on one page.
  await expect.soft(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  await expect.soft(page.getByRole('button', { name: 'Log out' })).toBeVisible();
  await expect.soft(page.getByTestId('cart-count')).toHaveText('0');
});
