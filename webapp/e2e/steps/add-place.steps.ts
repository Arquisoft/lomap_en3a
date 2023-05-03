import { defineFeature, loadFeature } from 'jest-cucumber';
import {setDefaultOptions} from "expect-puppeteer";
import puppeteer from "puppeteer";
import {fireEvent} from "@testing-library/react";

const feature = loadFeature('./features/add-place.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

setDefaultOptions({timeout: 30000})

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
      console.log(await page.content())
      const example = await page.waitForSelector('.leaflet-container');
      const bounding_box = await example!.boundingBox();

      await page.mouse.move(bounding_box!.x + bounding_box!.width / 2, bounding_box!.y + bounding_box!.height / 2);
      await page.mouse.down();
      await page.mouse.move(24, 19);
      await page.mouse.up()
      await page.waitForTimeout(2000)
      await expect(page).toClick('.content > :nth-child(1) > :nth-child(1)');
      await expect(page).toClick('.content > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :last-child')
      await expect(page).toClick('.leaflet-popup-content > form:nth-child(1) > input:nth-child(1)');
      await expect(page).toFillForm('.Place-form > :nth-child(2)', {
        name: placeName,
        description: "This is a test place"
      });
      await expect(page).toClick('button', {text: "Submit"});
    });

    then('The place can be seen on the map', async () => {
      await expect(page).toMatchElement('img.leaflet-marker-icon:last-child')
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});

