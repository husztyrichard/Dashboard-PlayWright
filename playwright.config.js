import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    headless: process.env.CI ? true : false,
    trace: 'on-first-retry',
  screenshot: 'only-on-failure',
    /* Set base URL used by tests (server serves the `frontend` folder at root) */
    baseURL: 'http://127.0.0.1:5500',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  /* Run a local static server before starting tests so `page.goto` works */
  webServer: {
    command: 'node ./start-servers.js',
    url: 'http://127.0.0.1:5500',
    reuseExistingServer: !process.env.CI,
  },
});