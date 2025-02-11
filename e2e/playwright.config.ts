import path from 'path';
import { config as dotenvConfig } from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
const envPath = path.resolve(__dirname, '../.env');
dotenvConfig({ path: envPath });
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: '',
  testMatch: '!(mobile)*.spec.ts',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { outputFolder: 'playwright/reporter' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 15 * 1000,
  outputDir: 'playwright/test-results',

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.HOME_LOCATION || 'http://127.0.0.1:8000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    storageState: 'e2e/playwright/.auth/certified-user.json',
    /* Use custom test attribute */
    testIdAttribute: 'data-playwright-test-label',
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'global-setup.ts'
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup']
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup']
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup']
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup']
    }
    /* Uncomment the blocks out if you want to enable the mentioned features */
    /* ====================================================== */
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' }
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    // }
  ],

  /* Some tests make the api send emails, so we need mailhog to catch them */
  webServer: {
    command: 'docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog',
    port: 1025,
    reuseExistingServer: true,
    timeout: 180000
  }
});
