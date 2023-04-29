import { defineFeature, loadFeature } from 'jest-cucumber';
import {setDefaultOptions} from "expect-puppeteer";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/filter.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

setDefaultOptions({timeout: 10000})

defineFeature(feature, test => {
  beforeEach(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: true});
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
      await expect(page).toClick('.content > :nth-child(2) > :nth-child(1)');
      await expect(page).toClick('.content > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :nth-child(1)');
      await expect(page).toClick('input[value="New..."]');
      await expect(page).toFillForm('.Place-form > :nth-child(2)', {
        name: placeName,
        description: "This is a test place"
      });
      await expect(page).toSelect('select[name="category"]', "park");
      await expect(page).toClick('button', {text: "Submit"});
    });
    

    when('The users selects the park category in the filter and clicks Search', async () => {
      await expect(page).toClick('input[value="park"]')
      await page.waitForTimeout(5000)
      await expect(page).toClick('button[type="submit"]')
    });

    then('The park can be seen in the map', async () => {
      await expect(page).toClick('.content > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :nth-child(1)');
      await expect(page).toMatch(placeName);
    });
  })

  test('A user employs the filter to see places of a category he/she has not used yet', ({given,when,then}) => {

    let username:string;
    let password:string;
    let placeName:string = "Test" + Math.floor(Math.random() * 100000);

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
      await expect(page).toClick('.content > :nth-child(2) > :nth-child(1)');
      await expect(page).toClick('.content > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :nth-child(1)');
      await expect(page).toClick('input[value="New..."]');
      await expect(page).toFillForm('.Place-form > :nth-child(2)', {
        name: placeName,
        description: "This is a test place"
      });
      await expect(page).toSelect('select[name="category"]', "park");
      await expect(page).toClick('button', {text: "Submit"});
    });


    when('The users selects the museum category in the filter and clicks Search', async () => {
      await expect(page).toClick('input[value="museum"]')
      await page.waitForTimeout(5000)
      await expect(page).toClick('button[type="submit"]')
    });

    then('The museum can not be seen in the map (there are no places in it)', async () => {
      //There are no places in the map
      await expect(page).not.toMatchElement('.content > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :nth-child(1)');
    });
  })

  afterEach(async ()=>{
    browser.close()
  })

});

