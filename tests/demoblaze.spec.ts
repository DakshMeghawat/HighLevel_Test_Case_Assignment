import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
  await page.goto('https://www.demoblaze.com/#');
});

test('Validate Homepage Title', async ({ page }) => {

    await expect(page).toHaveTitle(/STORE/);
  });
// for Home , Cart , Signin , Signup

test('Validate element with XPath', async ({ page }) => {
    // Locate the element using XPath
    const element = page.locator('//html/body/nav/div[1]');
    
    // Check if the element is visible
    await expect(element).toBeVisible();
  });

test('Validate buttons on top right corner of homepage', async ({ page }) => {

    await expect(page.locator('text=Home')).toBeVisible();
  

    await expect(page.locator('text=Cart')).toBeVisible();
  

    await expect(page.locator('a#signin2')).toBeVisible(); 

    await expect(page.locator('a#login2')).toBeVisible();
  });

//   test('Validate Contact Title', async ({ page }) => {

//     await expect(page).toHaveTitle(/Contact/);
//   });
 

test('check Samsung galaxy s6 is present on the homepage', async ({ page }) => {
    const samsungLink = page.locator('a', { hasText: 'Samsung galaxy s6' });
    await expect(samsungLink).toBeVisible();
  });
  

  test('Validate Slideshow Visibility', async ({ page }) => {
    const slideshow = page.locator('xpath=/html/body/nav/div[2]/div');
    await expect(slideshow).toBeVisible();
  });
  

