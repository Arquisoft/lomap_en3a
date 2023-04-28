import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from "puppeteer";

const feature = loadFeature('./features/login.feature');

let page: puppe;
let browser: puppeteer.Browser;

defineFeature(feature, test => {

  jest.setTimeout(100000); //for the times when SOLID servers are slow
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
      username = "test_lomapen3a"
      password = "test"
    });
    

    when('The users logs in the application', async () => {
      //The user clicks on log in
      await expect(page).toClick('button', { text: 'Log in' })
      await page.waitForNavigation()
      //The user fills the SOLID login form
      await expect(page).toFill("input[name='username']", username);
      await expect(page).toFill("input[name='password']", password);
      await expect(page).toClick("button[id='login']");
    });

    then('The main page appears', async () => {
      await page.waitForNavigation()
      await page.waitForNavigation()
      await expect(page).toMatch("Lomap");
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});

