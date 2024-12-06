import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Flight Booking', () => {
    test('Verify flight booking flow', async ({ page }) => {
        const homePage = new HomePage(page);

        // Step 1: Navigate to homepage
        await homePage.navigateToHomePage();

        // Step 2: Select flights tab
        await homePage.selectFlightsTab();

        // Step 3: Enter cities
        await homePage.enterCities('Pune', 'Mumbai');

        // await homePage.selectLowestPriceDateInDecember();
        await homePage.selectLowestPriceDateInMonth('December');

        await homePage.clickSearchButton();
        await page.pause();  
        // await page.waitForTimeout(10000);

        
    });
});