# Playwright 101

A hands-on intro to Playwright for QA. Everything runs locally against a tiny
"Demo Shop" app included in this repo, so tests are fast, stable and need no
internet or test environment.

## Setup (once)

```bash
npm install
npx playwright install chromium
```

## Running tests

| Command | What it does |
| --- | --- |
| `npm test` | Run all tests headless (no browser window) |
| `npx playwright test 03` | Run only files matching "03" |
| `npm run test:headed` | Run with a visible browser |
| `npm run test:ui` | **UI mode**: pick tests, watch them, time-travel through steps (best for learning) |
| `npm run test:debug` | Step through a test line by line with the Inspector |
| `npm run report` | Open the HTML report from the last run |
| `npm run app` | Start the demo app yourself at http://localhost:3000 |
| `npm run codegen` | Record clicks in a browser and get test code (start `npm run app` first) |

You don't need to start the app before running tests; Playwright does it for
you (see `webServer` in `playwright.config.ts`).

## The demo app

- `/`: login page (`qa@example.com` / `password123`)
- `/shop.html`: product list loaded from a slow API, search, category filter, cart
- `/contact.html`: form with select, radio, textarea, checkbox and a disabled button

## Lessons

Go through them in order. Each file starts with a comment explaining the idea.

| File | Topic | Key idea |
| --- | --- | --- |
| `01-first-test` | Anatomy of a test | `page.goto`, `expect`, every test gets a fresh browser |
| `02-locators` | Finding elements | Prefer `getByRole` / `getByLabel`; avoid CSS |
| `03-actions` | Interacting | `fill`, `click`, `check`, `selectOption`, `press` |
| `04-assertions` | Checking results | Web-first assertions retry automatically; `filter`; soft assertions |
| `05-login-scenarios` | Organising tests | `describe`, `beforeEach`, data-driven negative tests |
| `06-auto-waiting` | Timing | Never `waitForTimeout`; assert on what the user waits for |
| `07-network-mocking` | Network | `page.route` to fake API errors/data, `waitForResponse` |
| `08-page-objects` | Maintainability | Page Object Model (`/pages`) and `test.step` |
| `99-exercises` | Practice | 7 small tasks marked `test.fixme` |

Solutions for the trainer are in `solutions/` (outside `tests/`, so they don't run by default).

## Suggested session plan (~2h)

1. **Why automate, why Playwright** (10 min): cross-browser, auto-waiting, great tooling.
2. **Lessons 1 to 3 in UI mode** (30 min): run `npm run test:ui`, click a test, show the timeline and DOM snapshots.
3. **Codegen demo** (10 min): record the login flow and compare the output with lesson 3.
4. **Lessons 4 to 6** (25 min): spend time on auto-waiting; it is the #1 cause of flaky tests elsewhere.
5. **Break a test on purpose** (10 min): change an expected text, run it, open the report and the trace.
6. **Lessons 7 and 8** (15 min).
7. **Exercises** (20+ min): pairs work on `99-exercises.spec.ts`.

## Debugging a failing test

1. Read the error: Playwright prints the locator, the expected vs. received value and the line.
2. `npm run report`, open the failed test and click the **trace**: you see every action, the page
   before/after each step, console logs and network calls.
3. Re-run just that test with `--debug` or in UI mode.

## Cheat sheet

```ts
await page.goto('/');
page.getByRole('button', { name: 'Sign in' })
page.getByLabel('Email')
page.getByText('Welcome')
page.getByTestId('cart-count')
page.getByRole('listitem').filter({ hasText: 'Mug' })

await locator.fill('text');   await locator.click();
await locator.check();        await locator.selectOption('home');

await expect(locator).toBeVisible();
await expect(locator).toHaveText('exact');      // or toContainText
await expect(locator).toHaveCount(3);
await expect(page).toHaveURL(/shop/);
```

Docs: https://playwright.dev/docs/intro
