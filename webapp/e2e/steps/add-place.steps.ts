import { defineFeature, loadFeature } from 'jest-cucumber';
import {setDefaultOptions} from "expect-puppeteer";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/add-place.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

setDefaultOptions({timeout: 10000})

defineFeature(feature, test => {
  beforeAll(async () => {
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

  test('A user adds a new place in the map', ({given,when,then}) => {
    
    let username:string;
    let password:string;
    let placeName:string = "Test" + Math.floor(Math.random() * 100000);

    given('A user that is logged in', async () => {
      username = "testlomapen3a"
      password = "Test_lomapen3a"
      //The user clicks on log in
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
    });
    

    when('The users adds a place', async () => {
      await expect(page).toClick('.content > :nth-child(1) > :nth-child(1)');
      const [marker] = await page.$x('/html/body/div/div/div/div/section/div[2]/div/div/div[1]/div[4]/img')
      await marker.click();
      await expect(page).toClick('input[value="New..."]');
      await expect(page).toFillForm('.Place-form > :nth-child(2)', {
        name: placeName,
        description: "This is a test place"
      });
      await expect(page).toClick('button', {text: "Submit"});
    });

    then('The place can be seen on the map', async () => {
      const [marker] = await page.$x('/html/body/div/div/div/div/section/div[2]/div/div/div[1]/div[4]/img')
      await marker.click();
      await expect(page).toMatch(placeName);
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});

