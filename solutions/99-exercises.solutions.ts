/**
 * Solutions for tests/99-exercises.spec.ts (for the trainer).
 * Try the exercises first! To run these: copy this file into /tests
 * and rename it to end with .spec.ts.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';

test('1. "Remember me" checkbox can be ticked and unticked', async ({ page }) => {
  await page.goto('/');
  const remember = page.getByRole('checkbox', { name: 'Remember me' });
  await remember.check();
  await expect(remember).toBeChecked();
  await remember.uncheck();
  await expect(remember).not.toBeChecked();
});

test('2. contact form: Send button stays disabled without accepting terms', async ({ page }) => {
  await page.goto('/contact.html');
  await page.getByLabel('Full name').fill('Anna Tester');
  await page.getByLabel('Message').fill('Hello');
  await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled();
});

test('3. contact form: default contact preference is Email', async ({ page }) => {
  await page.goto('/contact.html');
  await expect(page.getByRole('radio', { name: 'Email' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Phone' })).not.toBeChecked();
});

test('4. searching is case-insensitive', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);
  await loginPage.open();
  await loginPage.login('qa@example.com', 'password123');
  await shopPage.searchInput.fill('MOUSE');
  await expect(shopPage.products).toHaveCount(1);
  await expect(shopPage.products).toContainText('Wireless Mouse');
});

test('5. adding all electronics gives a cart count of 2', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);
  await loginPage.open();
  await loginPage.login('qa@example.com', 'password123');
  await shopPage.categorySelect.selectOption('electronics');
  await shopPage.addToCart('Wireless Mouse');
  await shopPage.addToCart('Mechanical Keyboard');
  await expect(shopPage.cartCount).toHaveText('2');
});

test('6. mock an empty product list', async ({ page }) => {
  await page.route('**/api/products', (route) => route.fulfill({ json: [] }));
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('qa@example.com', 'password123');
  await expect(page.getByText('No products found')).toBeVisible();
});

test('7. turn a requirement into a test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);
  await loginPage.open();
  await loginPage.login('qa@example.com', 'password123');
  await shopPage.addToCart('Coffee Mug');
  await expect(shopPage.cartCount).toHaveText('1');

  await shopPage.logoutButton.click();
  await loginPage.login('qa@example.com', 'password123');

  await expect(shopPage.cartCount).toHaveText('0');
});
