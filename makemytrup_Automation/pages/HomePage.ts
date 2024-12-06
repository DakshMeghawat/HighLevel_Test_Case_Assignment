import { Page, Locator, expect } from '@playwright/test';
// import { locators } from '../locators/flightLocators';
import { locators } from '../locators/flightLocators1';

export class HomePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navigate to the home page
    async navigateToHomePage() {
        await this.page.goto('https://www.makemytrip.com/');
    }

    // Select the 'Flights' tab and close any modal if it appears
    async selectFlightsTab() {
        const modalCloseButton: Locator = this.page.locator('[data-cy="closeModal"]');

        // Close modal if visible
        if (await modalCloseButton.isVisible()) {
            await modalCloseButton.click();
        }

        // Wait for the modal to disappear before proceeding
        await this.page.locator('.imageSliderModal').waitFor({ state: 'detached' });

        // Click on the flight tab
        await this.page.click(locators.flightTab);
    }

    // Method to select the lowest priced date in a specific month
    // Method to select the lowest priced date in a specific month
async selectLowestPriceDateInMonth(month: string) {
    // Wait for the calendar to load
    await this.page.waitForSelector('.DayPicker-Month', { state: 'visible' });

    // Locate the month container for the specified month
    const monthContainer = this.page.locator(`.DayPicker-Month:has-text("${month}")`);

    // Ensure the specified month container is present
    if (!(await monthContainer.isVisible())) {
        throw new Error(`Month "${month}" is not visible on the calendar.`);
    }

    // Extract dates, prices, and aria-labels for the specified month using page.$$eval
    const prices = await this.page.$$eval(
        `.DayPicker-Month:has-text("${month}") .DayPicker-Day`,
        (days) => {
            return days
                .map((day) => {
                    const dateElement = day.querySelector('.dateInnerCell > p:first-child');
                    const priceElement = day.querySelector('.dateInnerCell > .todayPrice');
                    const ariaLabel = day.getAttribute('aria-label'); // Extract aria-label

                    if (priceElement && dateElement && ariaLabel) {
                        const date = dateElement.textContent?.trim();
                        const price = parseInt(
                            priceElement.textContent?.trim().replace(/,/g, '') || '0',
                            10
                        );
                        return { date, price, ariaLabel }; // Return aria-label with date and price
                    }
                    return null;
                })
                .filter((item): item is { date: string; price: number; ariaLabel: string } => item !== null && item.price > 0);
        }
    );

    // Ensure prices were extracted successfully
    if (prices.length === 0) {
        throw new Error(`No valid prices found for the month "${month}".`);
    }

    // Find the date with the lowest price
    const lowestPriceDay = prices.reduce(
        (min, day) => (day.price < min.price ? day : min),
        prices[0]
    );

    console.log(
        `Lowest price date in ${month}: ${lowestPriceDay.date}, Price: ${lowestPriceDay.price}, Full Date: ${lowestPriceDay.ariaLabel}`
    );

    // Find the locator for the lowest price date using aria-label and date
    const lowestPriceLocator = monthContainer.locator(
        `.DayPicker-Day[aria-label="${lowestPriceDay.ariaLabel}"]`
    );
    // Print the HTML content of the locator
    const innerHTML = await lowestPriceLocator.innerHTML();
    console.log('Lowest price locator content:', innerHTML);

    // Optionally, you can also print other properties, such as the outer HTML or text content:
    const outerHTML = await lowestPriceLocator.evaluate(el => el.outerHTML);
    console.log('Outer HTML of lowest price locator:', outerHTML);

    // Alternatively, print the text content
    const textContent = await lowestPriceLocator.textContent();
    console.log('Text content of lowest price locator:', textContent);

    // Debugging: Log information about matching elements
    const count = await lowestPriceLocator.count();
    console.log(`Matching elements count: ${count}`);
    if (count === 0) {
        console.error(`Available DOM for ${month}:`);
        console.log(await this.page.locator(`.DayPicker-Month:has-text("${month}")`).innerHTML());
        throw new Error('No matching element found for the lowest price date.');
    } else if (count > 1) {
        console.warn(
            `Multiple elements match the lowest price date. Using the first match.`
        );
    }

    // Scroll the element into view and interact with it
    await lowestPriceLocator.first().scrollIntoViewIfNeeded();
    await lowestPriceLocator.first().click({ force: true });

}

    

    // Method to select cities for the flight search
    async enterCities(from: string, to: string) {
        // Select the 'From' city
        const fromCityInput: Locator = this.page.locator(locators.fromCity);
        await fromCityInput.click();

        const fromCityInputField: Locator = this.page.locator('input.react-autosuggest__input');
        await fromCityInputField.fill(from);

        const fromCitySuggestions: Locator = this.page.locator('ul.react-autosuggest__suggestions-list:visible');
        await fromCitySuggestions.waitFor({ state: 'visible' });

        await this.page.locator(`text=${from}`).first().click();

        // Select the 'To' city
        const toCityInput: Locator = this.page.locator(locators.toCity);
        await toCityInput.click();

        const toCityInputField: Locator = this.page.locator('input.react-autosuggest__input');
        await toCityInputField.fill(to);

        const toCitySuggestions: Locator = this.page.locator('ul.react-autosuggest__suggestions-list:visible');
        await toCitySuggestions.waitFor({ state: 'visible' });

        await this.page.locator(`text=${to}`).first().click();
    }

    // Method to click on the search button
async clickSearchButton() {
    // Locate the search button using the XPath locator from the 'locators' object
    const searchButton: Locator = this.page.locator(locators.searchButton);
    
    // Optionally, wait for the search button to be visible before clicking (if necessary)
    await searchButton.waitFor({ state: 'visible' });
    
    // Click on the search button
    await searchButton.click();
}
}
