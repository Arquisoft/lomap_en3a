import { defineFeature, loadFeature } from 'jest-cucumber';
import {setDefaultOptions} from "expect-puppeteer";
import puppeteer, {ElementHandle} from "puppeteer";

const feature = loadFeature('./features/filter.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

setDefaultOptions({timeout: 50000})

defineFeature(feature, test => {
  beforeEach(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 20});
    page = await browser.newPage();

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('A user employs the filter to see places of a category he/she has already used', ({given,when,then}) => {

    let username:string;
    let password:string;
    let placeName:string = "Test" + Math.floor(Math.random() * 100000);
    let locationsNumber = 0;

    given('A user that has a park in the map', async () => {
      username = "testlomapen3a"
      password = "Test_lomapen3a"
      //The user logs in
      await expect(page).toClick('input[value="Inrupt.net"]')
      await page.waitForNavigation()
      //The user fills the SOLID login form
      await expect(page).toFillForm('form[class="form-horizontal login-up-form"]', {
        username: username,
        password: password
      });
      await expect(page).toClick("button", {text: 'Log In'});
      await page.waitForNavigation()
      await expect(page).toMatch("Home");
      //Adding a park
      await page.waitForFunction(() => !document.querySelector('.MuiCircularProgress-svg'));
      const example = await page.waitForSelector('.leaflet-container');
      const bounding_box = await example!.boundingBox();

      await page.mouse.move(bounding_box!.x + bounding_box!.width / 2, bounding_box!.y + bounding_box!.height / 2);
      await page.mouse.down();
      await page.mouse.move(Math.floor(Math.random() * 25), Math.floor(Math.random() * 25));
      await page.mouse.up()
      await page.waitForTimeout(2000)
      await expect(page).toClick('.content > :nth-child(1) > :nth-child(1)');
      await expect(page).toClick('.content > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :last-child')
      await expect(page).toClick('input[value="New..."]');
      await expect(page).toFillForm('.Place-form > :nth-child(2)', {
        name: placeName,
        description: "This is a test place"
      });
      await expect(page).toSelect('select[name="category"]', "park");
      await expect(page).toClick('button', {text: "Submit"});
    });


    when('The users selects the park category in the filter and clicks Search', async () => {
      const [showFiltersButton] = await page.$x('//*[@id="basic-button"]')
      await showFiltersButton.click();
      await expect(page).toClick('.categoriesFilterContainer > p:nth-child(4) > input:nth-child(1)')
      await page.waitForTimeout(5000)
      await expect(page).toClick('.search-filter')
    });

    then('The park can be seen in the map', async () => {
      await expect(page).toClick('.MuiBackdrop-root')
      //The place can be found on the map
      await expect(page).toMatchElement('img.leaflet-marker-icon:last-child')
    });
  })

  test('A user employs the filter to see places of a category he/she has not used yet', ({given,when,then}) => {

    let username:string;
    let password:string;
    let placeName:string = "Test" + Math.floor(Math.random() * 100000);
    let locationsNumber = 0

    given('A user that has a park in the map', async () => {
      username = "testlomapen3a"
      password = "Test_lomapen3a"
      //The user logs in
      await expect(page).toClick('input[value="Inrupt.net"]')
      await page.waitForNavigation()
      //The user fills the SOLID login form
      await expect(page).toFillForm('form[class="form-horizontal login-up-form"]', {
        username: username,
        password: password
      });
      await expect(page).toClick("button", {text: 'Log In'});
      await page.waitForNavigation()
      await expect(page).toMatch("Home");
      //Adding a park
      await page.waitForFunction(() => !document.querySelector('.MuiCircularProgress-svg'));
      const example = await page.$('.leaflet-container');
      const bounding_box = await example!.boundingBox();

      await page.mouse.move(bounding_box!.x + bounding_box!.width / 2, bounding_box!.y + bounding_box!.height / 2);
      await page.mouse.down();
      await page.mouse.move(Math.floor(Math.random() * 25), Math.floor(Math.random() * 25));
      await page.mouse.up()
      await page.waitForTimeout(2000)
      console.log('hola')
      await expect(page).toClick('.content > :nth-child(1) > :nth-child(1)');
      await expect(page).toClick('.content > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :last-child')
      await expect(page).toClick('.leaflet-popup-content > form:nth-child(1) > input:nth-child(1)');
      await expect(page).toFillForm('.Place-form > :nth-child(2)', {
        name: placeName,
        description: "This is a test place"
      });
      await expect(page).toSelect('select[name="category"]', "park");
      await expect(page).toClick('button', {text: "Submit"});
    });


    when('The users selects the museum category in the filter and clicks Search', async () => {
      const [showFiltersButton] = await page.$x('//*[@id="basic-button"]')
      await showFiltersButton.click();
      console.log('hola2')
      await expect(page).toClick('input[value="museum"]')
      await page.waitForTimeout(5000)
      await expect(page).toClick('.search-filter')
    });

    then('The museum can not be seen in the map', async () => {
      await expect(page).toClick('.MuiBackdrop-root')
      //There are no places in the map
      await expect(page).not.toMatchElement('img.leaflet-marker-icon:last-child')
    });
  })

  afterEach(async ()=>{
    browser.close()
  })

});

