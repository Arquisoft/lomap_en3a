import React from 'react';
import {fireEvent, render} from "@testing-library/react";
import PointInformation from '../../pages/PointInformation';
import Map from "../../domain/Map";
import Placemark from '../../domain/Placemark';
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
import PODManager from "../../adapters/solid/PODManager";
import Place from "../../domain/Place";

// To prevent crypto error
const crypto = require('crypto');

Object.defineProperty(globalThis, 'crypto', {
    value: {
        randomUUID: () => crypto.randomUUID()
    }
});

// Place to use in the tests
let place: Place;
// Placemark to use in the tests
let point: Placemark;


beforeAll(() => {
    place = new Place("Test", 0, 0, "test", [], "testId", "test");
    point = new Placemark(100, 100, "Test", "url", "Test");
    // Mocking the logic for getting the WebID
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "https://testWebID.inrupt.com";
    });

    //Mocking the logic to get a place from a pod
    jest.spyOn(PODManager.prototype, "getPlace").mockImplementation(async (url) => {
        // Return the test place
        return place;
    });

    // Mocking the logic to set a place as public
    jest.spyOn(PODManager.prototype, "setPublicAccess").mockImplementation(async (url, isPublic) => {
        // We do nothing
        return;
    });

    // Mocking this domain function as it was giving problems to the execution of the tests
    jest.spyOn(Placemark.prototype, "isOwner").mockImplementation((webID) => {
        return true;
    });
})

test('Check that when I change the view of the Place Info the review is shown', async () => {
    const map: Map = new Map("Test Map", "Test");
    const {getByText} = render(<PointInformation open={true} placemark={point} map={map}></PointInformation>);
    // We click the Reviews button
    const button = getByText("Reviews");
    fireEvent.click(button);
    // We should see the comments and Average Rating lines
    expect(getByText("Comments")).toBeInTheDocument();
    expect(getByText("Average Rating")).toBeInTheDocument();
});

test('Check that when I change the view of the Place Info the overview is shown', async () => {
    const map: Map = new Map("Test Map", "Test");
    const {getByText} = render(<PointInformation open={true} placemark={point} map={map}></PointInformation>);
    // We click the Reviews button
    const button = getByText("Reviews");
    fireEvent.click(button);
    // We go back to the Overview
    const button2 = getByText("Overview");
    fireEvent.click(button2);
    // We should see the Overview page now
    expect(getByText("Publish a comment")).toBeInTheDocument();
    expect(getByText("Submit a review")).toBeInTheDocument();
});