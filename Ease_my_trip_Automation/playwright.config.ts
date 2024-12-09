import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Define the folder where your tests will be located
  retries: 0,         // Number of retries on failure (optional)
  timeout: 1200000,     // Default test timeout (optional)
    projects: [
        // {
        //   name: 'chromium',
        //   use: { ...devices['Desktop Chrome'] },
        // },

        {
        name: 'firefox',
        use: 
        { ...devices['Desktop Firefox'],
            headless:false,
            launchOptions:{ slowMo:1000},
            // viewport: { width: 1280, height: 720 },
            viewport: { width: 1920, height: 1080 },
            // slowMo: 50, 

        },
        

        },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],
});
