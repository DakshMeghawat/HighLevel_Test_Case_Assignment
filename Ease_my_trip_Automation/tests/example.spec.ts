import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // Go to a website
  await page.goto('https://example.com');
  
  // Check if the page has the correct title
  await expect(page).toHaveTitle('Example Domain');
});
