const { chromium } = require('playwright');
const { expect } = require('expect');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.aviasales.com/');
  
  await page.waitForSelector('[data-test-id="switch"]', { state: 'visible' });
  await page.click('[data-test-id="switch"]');  

  await page.fill('[data-test-id="origin-autocomplete-field"]', 'John F. Kennedy International Airport');
  await page.waitForTimeout(2000);

  await page.waitForSelector('[data-test-id="destination-autocomplete-field"]', { state: 'visible' });
  await page.fill('[data-test-id="destination-autocomplete-field"]', 'Berlin');

  await page.waitForSelector('[data-test-id="departure-date-field"]', { state: 'visible' });
  await page.click('[data-test-id="departure-date-field"]'); 

  await page.waitForSelector('div[aria-label="Mon Oct 30 2023"]', { state: 'visible' });
  await page.click('div[aria-label="Mon Oct 30 2023"]');

  await page.waitForSelector('[data-test-id="passengers-field"]', { state: 'visible' });
  await page.click('[data-test-id="passengers-field"]'); 
  
  const elements = await page.$$('[data-test-id="tooltip-wrapper"]');
  await elements[1].click();
 
  await page.waitForSelector('[data-test-id="form-submit"]', { state: 'visible' });
  await page.click('[data-test-id="form-submit"]'); 
  
  const pages = await context.pages();
  const newPage = pages[pages.length - 1];
  const url = await newPage.url();
  expect(url.startsWith('https://www.aviasales.com/search/')).toBeTruthy();
  
  const destination = await page.inputValue('[data-test-id="destination-autocomplete-field"]');
  expect(destination).toBe('Berlin');
 
  const departure = await page.inputValue('[data-test-id="departure-date-input"]');
  expect(departure).toBe('Mon, October 30');
 
  const passengersText = await page.textContent('[data-test-id="passengers-field"] .additional-fields__label');
  expect(passengersText).toBe('2 passengers');

  await browser.close();

})();
