import { defineFeature, loadFeature } from 'jest-cucumber';
import {setDefaultOptions} from "expect-puppeteer";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/logout.feature');

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

  test('A user with a SOLID account logs out', ({given,when,then}) => {
    
    let username:string;
    let password:string;

    given('A user with a SOLID account that has logged in the application', async () => {
      username = "lomapen3a"
      password = "Placemarks3!"
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
    

    when('The users logs out the application', async () => {
      await expect(page).toClick('.Right > :nth-child(1) > :nth-child(1)');
      await expect(page).toClick('.LogoutButton');
    });

    then('The app goes to the login page', async () => {
      await page.waitForNavigation()
      await expect(page).toMatch("Select your POD provider");
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});

