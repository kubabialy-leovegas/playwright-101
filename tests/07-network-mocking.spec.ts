/**
 * LESSON 7: Controlling the network
 *
 * page.route() lets the test intercept requests the page makes. Great for:
 *   - testing error states that are hard to trigger on a real backend
 *   - feeding the UI exact data so tests are stable
 *   - testing without the backend being ready yet
 *
 * IMPORTANT: set up route() BEFORE the page makes the request.
 */
import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('shows an error when the products API fails', async ({ page }) => {
  await page.route('**/api/products', (route) =>
    route.fulfill({ status: 500, body: 'Internal Server Error' }),
  );

  await login(page);

  await expect(page.getByText('Could not load products. Please try again later.')).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(0);
});

test('renders whatever data the API returns', async ({ page }) => {
  await page.route('**/api/products', (route) =>
    route.fulfill({
      json: [{ id: 99, name: 'Test Product', category: 'home', price: 1 }],
    }),
  );

  await login(page);

  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('listitem')).toContainText('Test Product - $1.00');
});

test('wait for a real API response and inspect it', async ({ page }) => {
  // Start listening BEFORE the action that triggers the request.
  const responsePromise = page.waitForResponse('**/api/products');

  await login(page);

  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveLength(5);
});
