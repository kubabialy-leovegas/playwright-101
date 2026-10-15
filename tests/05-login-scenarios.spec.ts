/**
 * LESSON 5: Organising tests and covering scenarios
 *
 *   test.describe()   group related tests (shows up nicely in reports)
 *   test.beforeEach() shared setup that runs before every test in the group
 *   loops            one test per row of data ("data-driven" tests)
 *
 * Think like a QA: happy path + negative paths + edge cases.
 */
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('happy path: valid user lands on the shop', async ({ page }) => {
    await page.getByLabel('Email').fill('qa@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/shop.html');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  // Data-driven negative tests: one test is generated per row.
  const invalidLogins = [
    { case: 'wrong password', email: 'qa@example.com', password: 'nope', error: 'Invalid email or password' },
    { case: 'unknown user', email: 'ghost@example.com', password: 'password123', error: 'Invalid email or password' },
    { case: 'empty email', email: '', password: 'password123', error: 'Email and password are required' },
    { case: 'empty password', email: 'qa@example.com', password: '', error: 'Email and password are required' },
  ];

  for (const { case: name, email, password, error } of invalidLogins) {
    test(`shows an error for ${name}`, async ({ page }) => {
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Password').fill(password);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page.getByRole('alert')).toHaveText(error);
      await expect(page).toHaveURL('/'); // we stayed on the login page
    });
  }

  test('logout returns the user to the login page', async ({ page }) => {
    await page.getByLabel('Email').fill('qa@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.getByRole('button', { name: 'Log out' }).click();

    await expect(page).toHaveURL('/');
  });

  test('shop is protected: anonymous user is redirected to login', async ({ page }) => {
    await page.goto('/shop.html');
    await expect(page).toHaveURL('/');
  });
});
