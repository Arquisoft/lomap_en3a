import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import LeafletMapAdapter from "./LeafletMapAdapter";
import PODManager from "../solid/PODManager";

beforeAll(() => {

    // We  mock the implementation of the map saving functionality
    jest.spyOn(PODManager.prototype, "saveMap").mockImplementation(async (map) => {

        }
    )
});

test('The map renders correctly with no props given', async () => {

    render(<LeafletMapAdapter/>)
    expect(document.querySelector(".MapContainer") != null);

});

test('A placemark is added when the user clicks on the map', async () => {
    render(<LeafletMapAdapter/>);
    let map = document.querySelector(".leaflet-container") as Element;
    fireEvent.click(map);
    let markers = document.querySelector("div.leaflet-pane:nth-child(4)");
    expect(markers);
    let images = (markers as Element).getElementsByTagName("img");
    expect(images.length > 0);
    let marker = images[images.length - 1];
    expect(marker.getAttribute("src")?.startsWith("/static/media"));
});