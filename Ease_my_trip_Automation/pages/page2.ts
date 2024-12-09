import { Page, Locator } from '@playwright/test';
import { locators } from '../locators/flight_locators';

export class Page2 {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Wait for the flight list container to load after navigating
    async waitForFlightListToLoad() {
        // Wait for the flight result container (based on the XPath you provided)
        const flightListContainer: Locator = this.page.locator('//*[@id="ResultDiv"]/div/div/div[4]/div[2]');
        
        // Wait for the element to be visible
        await flightListContainer.waitFor({ state: 'visible', timeout: 120000 }); // Set to 60 seconds

        
        console.log('Flight list loaded and ready.');
    }

    // Method to click the "Book Now" button on the cheapest flight
    async clickBookNowButton() {
        // Locate the "Book Now" button for the cheapest flight (XPath you provided earlier)
        const bookNowButton: Locator = this.page.locator('//*[@id="ResultDiv"]/div/div/div[4]/div[2]/div[1]/div[1]/div[6]/button[1]');
        
        // Wait for the "Book Now" button to be visible
        await bookNowButton.waitFor({ state: 'visible' });

        // Click on the "Book Now" button for the first (cheapest) flight
        await bookNowButton.click();
        console.log('Clicked on the Book Now button for the cheapest flight.');
    }

    // async promocodecheck (code : string) {

    //     const locate_clear_promocode: Locator = this.page.locator(locators.clear_promocode);
    //     await locate_clear_promocode.click();

    //     const promocode_input_field: Locator = this.page.locator(locators.promocode);

    //     await promocode_input_field.fill(code);

    //     const apply_code : Locator = this.page.locator(locators.apply);
    //     await apply_code.click();

    // }

    async promocodecheck(code: string): Promise<string> {
        // Clear any existing promo code
        const locate_clear_promocode: Locator = this.page.locator(locators.clear_promocode);
        await locate_clear_promocode.click();
    
        // Enter the promo code
        const promocode_input_field: Locator = this.page.locator(locators.promocode);
        await promocode_input_field.fill(code);
    
        // Click the apply button
        const apply_code: Locator = this.page.locator(locators.apply);
        await apply_code.click();
    
        // Wait for the result message to appear
        const promo_message: Locator = this.page.locator('#easeFareDetails1_promodiv');
        await promo_message.waitFor({ state: 'visible', timeout: 10000 }); // Wait up to 10 seconds for the message
    
        // Get the text content of the promo message
        const messageText = await promo_message.textContent();
    
        // Log the message for debugging
        console.log(`Promo code result message: ${messageText}`);
    
        // Return the message text
        return messageText || '';
    }
    

    // Wait for Fare Summary section to load
    async waitForFareSummaryToLoad() {
        const fareSummaryLocator: Locator = this.page.locator('#divFareSummary');
        await fareSummaryLocator.waitFor({ state: 'visible', timeout: 10000 }); // 10 seconds timeout
        console.log('Fare summary loaded.');
    }




    async applyPromoCodeAndVerify(code: string, price: number): Promise<void> {
        if (price === undefined || price === null) {
            throw new Error('Price is undefined or null when calling applyPromoCodeAndVerify.');
        }
    
        console.log(`Price passed to applyPromoCodeAndVerify: ₹${price}`);
    
        // Clear any existing promo code
        const locate_clear_promocode: Locator = this.page.locator(locators.clear_promocode);
        await locate_clear_promocode.click();
    
        // Enter the promo code
        const promocode_input_field: Locator = this.page.locator(locators.promocode);
        await promocode_input_field.fill(code);
    
        // Apply the promo code
        const apply_code: Locator = this.page.locator(locators.apply);
        await apply_code.click();
    
        // Wait for the promo message
        const promo_message: Locator = this.page.locator('#easeFareDetails1_promodiv');
        await promo_message.waitFor({ state: 'visible', timeout: 10000 });
    
        const messageText = await promo_message.textContent();
        console.log(`Promo code result message: ${messageText}`);
    
        const grandTotalLocator: Locator = this.page.locator('#spnGrndTotal');
        const grandTotalText = await grandTotalLocator.textContent();
        const grandTotalValue = parseFloat(grandTotalText?.replace(/[^0-9.]/g, '') || '0');
    
        if (messageText?.includes("Congratulations! Instant Discount of Rs.350 has been applied successfully.")) {
            const discountLocator: Locator = this.page.locator('#spnCouponDst');
            const discountText = await discountLocator.textContent();
            const discountValue = parseFloat(discountText?.replace(/[^0-9.]/g, '') || '0');
    
            const expectedGrandTotal = price - discountValue;
    
            if (grandTotalValue !== expectedGrandTotal) {
                throw new Error(`Calculation error: Grand Total (₹${grandTotalValue}) != Expected (₹${expectedGrandTotal})`);
            } else {
                console.log('Discount applied successfully and Grand Total verified.');
            }
        } else if (messageText?.includes("Invalid Coupon")) {
            if (grandTotalValue !== price) {
                throw new Error(`Mismatch: Grand Total (₹${grandTotalValue}) != Price (₹${price}) for invalid coupon.`);
            } else {
                console.log('Grand Total verified for invalid coupon.');
            }
        } else {
            throw new Error(`Unexpected promo message: ${messageText}`);
        }
    }
    
}
