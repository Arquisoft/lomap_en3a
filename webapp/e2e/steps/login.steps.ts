import { defineFeature, loadFeature } from 'jest-cucumber';
import {setDefaultOptions} from "expect-puppeteer";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/login.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

setDefaultOptions({timeout: 5000})

defineFeature(feature, test => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('A user with a SOLID account logs in the application', ({given,when,then}) => {
    
    let username:string;
    let password:string;

    given('A user with a SOLID account', () => {
      username = "testlomapen3a"
      password = "Test_lomapen3a"
    });
    

    when('The users logs in the application', async () => {
      //The user clicks on log in
      await expect(page).toClick('input[value="Inrupt.net"]')
      await page.waitForNavigation()
      //The user fills the SOLID login form
      await expect(page).toFillForm('form[class="form-horizontal login-up-form"]', {
        username: username,
        password: password
      });
      await expect(page).toClick("button", {text: 'Log In'});
      //await page.waitForTimeout(5000)
    });

    then('The app goes to main page', async () => {
      await page.waitForNavigation()
      await expect(page).toMatch("Home");
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});

