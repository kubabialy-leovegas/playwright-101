/**
 * LESSON 3: Actions - interacting with the page
 *
 *   fill()         type into an input (clears it first)
 *   click()        click a button / link
 *   check()        tick a checkbox or radio  (uncheck() for the opposite)
 *   selectOption() pick from a <select>
 *   press()        press a keyboard key, e.g. 'Enter'
 *
 * Before every action Playwright automatically waits until the element is
 * visible, enabled and stable. You do NOT need manual waits/sleeps.
 */
import { test, expect } from '@playwright/test';

test('fill in and submit the contact form', async ({ page }) => {
  await page.goto('/contact.html');

  await page.getByLabel('Full name').fill('Anna Tester');
  await page.getByLabel('Topic').selectOption('payment');        // by value
  await page.getByRole('radio', { name: 'Phone' }).check();
  await page.getByLabel('Message').fill('My payment did not go through.');

  // The Send button is disabled until terms are accepted.
  const send = page.getByRole('button', { name: 'Send message' });
  await expect(send).toBeDisabled();

  await page.getByLabel('I agree to the terms').check();
  await expect(send).toBeEnabled();

  await send.click();

  // The app takes ~0.5s to "send" - expect() keeps retrying until it passes.
  await expect(page.getByRole('status')).toHaveText('Thanks Anna Tester! We will reply by phone.');
});

test('submit the login form with the Enter key', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Email').fill('qa@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByLabel('Password').press('Enter');

  await expect(page).toHaveURL('/shop.html');
});
