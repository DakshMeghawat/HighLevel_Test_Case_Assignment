import { Page, Locator, BrowserContext } from '@playwright/test';
import { locators } from '../locators/flight_locators'; 

export class HomePage {
    private page: Page;
    private context: BrowserContext;

    constructor(page: Page) {
        this.page = page;
        this.context = page.context();
    }

    // This should be set up in the constructor or outside navigateToHomePage
    private setupRequestInterception() {
        // Use page.route instead of setRequestInterception
        this.page.route('**/*', (route, request) => {
            // Modify the headers before continuing the request
            const headers = {
                ...request.headers(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            };
            route.continue({ headers }); // Continue the request with modified headers
        });
    }

    // Grant location permissions and navigate to the home page
    async navigateToHomePage() {
        // Grant location permission to avoid pop-ups
        await this.context.grantPermissions(['geolocation']);

        // Set up request interception
        this.setupRequestInterception();

        // Navigate to the home page
        await this.page.goto('https://www.easemytrip.com/', {
            waitUntil: 'load',
        });
    }

    // Select the 'Flights' tab and close any modal if it appears
    async selectFlightsTab() {
        // Click on the flight tab
        await this.page.click(locators.flightTab);
    }

    


    // Method to extract and select the cheapest date based on the price
    async selectCheapestDate(): Promise<number>  {
        // Locate all the <li> elements that contain the dates and prices
        const dateElements = await this.page.locator('.box .days ul li');
    
        let cheapestPrice = Infinity;
        let cheapestDateId: string | null = null;
    
        // Loop through each <li> element to extract the date and price
        for (let i = 0; i < await dateElements.count(); i++) {
            const dateElement = dateElements.nth(i);
    
            // Extract the <span> element that contains the price
            const priceText = await dateElement.locator('span').textContent();
            const dateId = await dateElement.locator('span').getAttribute('id');
            
            // Extract the numeric value of the price
            const price = priceText ? parseInt(priceText.replace(/[^\d]/g, ''), 10) : Infinity;
    
            // Compare and track the cheapest price
            if (price < cheapestPrice) {
                cheapestPrice = price;
                cheapestDateId = dateId;  // Save the id of the cheapest date
            }
        }
    
        // Log the cheapest date and its price
        if (cheapestDateId) {
            console.log(`Cheapest Date ID: ${cheapestDateId}, Price: ₹${cheapestPrice}`);
    
            // Safely construct a selector using Playwright's locator syntax
            await this.page.locator(`[id="${cheapestDateId}"]`).click();
            return cheapestPrice;
    
        } else {
            console.log('No valid date found in the calendar.');
        }
        return cheapestPrice;
    }

    // Method to select cities for the flight search
    async enterCities(from: string, to: string) {
        const fromCityInput: Locator = this.page.locator(locators.fromCity);
        await fromCityInput.click();

        const fromCityInputField: Locator = this.page.locator(locators.from_city_dropdown);
        await fromCityInputField.fill(from);

        const fromCitySuggestions: Locator = this.page.locator(locators.from_autofill);
        await fromCitySuggestions.waitFor({ state: 'visible' });

        await this.page.locator(`text=${from}`).first().click();

        const toCityInput: Locator = this.page.locator(locators.toCity);
        await toCityInput.click();

        const toCityInputField: Locator = this.page.locator(locators.to_city_dropdown);
        await toCityInputField.fill(to);

        // Refine locator for "To City" suggestions by using the specific element where suggestions for "To" cities appear
        const toCitySuggestionsList: Locator = this.page.locator('#toautoFill');  
        await toCitySuggestionsList.waitFor({ state: 'visible' });

        // Select the 'To' city from the suggestion list by matching the text
        const toCityItem: Locator = this.page.locator(`#toautoFill >> text=${to}`);  
        await toCityItem.click();
    }

    async clickSearchButton() {
        const searchButton: Locator = this.page.locator(locators.searchButton);
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
    }
}


