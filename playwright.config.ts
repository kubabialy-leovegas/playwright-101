import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Where the tests live.
  testDir: './tests',

  // Run test files in parallel.
  fullyParallel: true,

  // Retry failed tests once on CI, never locally (so we see flakiness).
  retries: process.env.CI ? 1 : 0,

  // HTML report you can open with: npm run report
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // Lets us write page.goto('/shop.html') instead of the full URL.
    baseURL: 'http://localhost:3000',

    // Record a trace when a test fails the first time; open it with the Trace Viewer.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Install more browsers with `npx playwright install` and uncomment:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Playwright starts our demo app before the tests and stops it after.
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
