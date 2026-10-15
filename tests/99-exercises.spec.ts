/**
 * EXERCISES - your turn!
 *
 * Each test below is marked `test.fixme`, so it is skipped.
 * To work on one: change `test.fixme` to `test`, write the steps, run it:
 *     npx playwright test 99 --headed
 *
 * Stuck? Try `npm run codegen` to record the clicks, or look at lessons 1-8.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';

test.fixme('1. "Remember me" checkbox can be ticked and unticked', async ({ page }) => {
  // Open the login page, check the box, assert it is checked,
  // uncheck it, assert it is NOT checked.
});

test.fixme('2. contact form: Send button stays disabled without accepting terms', async ({ page }) => {
  // Open /contact.html, fill the name and message, do NOT tick terms,
  // assert the "Send message" button is disabled.
});

test.fixme('3. contact form: default contact preference is Email', async ({ page }) => {
  // Hint: getByRole('radio', { name: 'Email' }) and toBeChecked()
});

test.fixme('4. searching is case-insensitive', async ({ page }) => {
  // Log in, type "MOUSE" in search, assert exactly 1 product: Wireless Mouse.
});

test.fixme('5. adding all electronics gives a cart count of 2', async ({ page }) => {
  // Use LoginPage and ShopPage. Filter by "electronics", add both, check the cart.
});

test.fixme('6. mock an empty product list', async ({ page }) => {
  // Use page.route() to return json: [] and assert "No products found" is shown.
  // Remember: route BEFORE logging in.
});

test.fixme('7. turn a requirement into a test', async ({ page }) => {
  // Product requirement: "Cart count resets to 0 after logout and login again".
  // Write a test that proves it. Think: what are the steps and the expected result?
});
