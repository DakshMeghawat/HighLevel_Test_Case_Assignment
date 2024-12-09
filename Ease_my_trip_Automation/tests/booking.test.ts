import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/Homepage';
import { Page2 } from '../pages/page2';

test.describe('Flight Booking', () => {
    test('Verify flight booking flow', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.navigateToHomePage();

        await homePage.selectFlightsTab();

        await homePage.enterCities('Goa', 'Mumbai');

        const price = await homePage.selectCheapestDate();

        console.log(`Cheapest price: ₹${price}`);

        await homePage.clickSearchButton();

         // Wait for the flight list to load (on the second page)
         const page2 = new Page2(page);  // Create an instance of Page2
         await page2.waitForFlightListToLoad(); // Wait for the flight results page to load
 
         // Step 6: Click the "Book Now" button on the cheapest flight
         await page2.clickBookNowButton();

         await page2.waitForFareSummaryToLoad();

         await page2.applyPromoCodeAndVerify('BOOKNOW',price);

        await page.pause();  
        
    });
});