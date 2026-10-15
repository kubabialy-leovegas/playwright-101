/**
 * LESSON 8: Page Object Model (POM)
 *
 * Compare this file with lesson 4/5: the tests read like a test case in
 * plain English, and all the "how to find things" lives in /pages.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';

test('user buys two items', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.open();
  await loginPage.login('qa@example.com', 'password123');

  await expect(shopPage.heading).toBeVisible();
  await shopPage.addToCart('Wireless Mouse');
  await shopPage.addToCart('Running Shoes');

  await expect(shopPage.cartCount).toHaveText('2');
});

test('wrong password shows an error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('qa@example.com', 'wrong');

  await loginPage.expectError('Invalid email or password');
});

test('test.step makes reports easier to read', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  // Steps show up as collapsible sections in the HTML report and trace.
  await test.step('Log in', async () => {
    await loginPage.open();
    await loginPage.login('qa@example.com', 'password123');
  });

  await test.step('Filter by sports', async () => {
    await shopPage.categorySelect.selectOption('sports');
    await expect(shopPage.products).toHaveCount(1);
  });

  await test.step('Add the shoes to the cart', async () => {
    await shopPage.addToCart('Running Shoes');
    await expect(shopPage.cartCount).toHaveText('1');
  });
});
