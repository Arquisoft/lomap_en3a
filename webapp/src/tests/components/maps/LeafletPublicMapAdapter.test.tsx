import PODManager from "../../../adapters/solid/PODManager";
import LeafletPublicMapAdapter from "../../../adapters/map/LeafletPublicMapAdapter";
import {fireEvent, getByText, render, screen, waitFor} from "@testing-library/react";
import Placemark from "../../../domain/Placemark";
import LeafletMapAdapter from "../../../adapters/map/LeafletMapAdapter";
import React from "react";
let api = require("../../../api/api");

beforeAll(() => {

    // We  mock the implementation of the map saving functionality
    jest.spyOn(api, "addPlace").mockImplementation(async (map) => {
        // do not add the map to the database
    })
});

test('The "new" button of the popup shows the add place page', async () => {

    // Click on the map
    let component = React.createRef<LeafletPublicMapAdapter>();
    render(<LeafletPublicMapAdapter ref={component} />);
    let map = document.querySelector(".leaflet-container") as Element;
    fireEvent.click(map);

    // Get markers
    let markersBefore = document.querySelectorAll(".leaflet-marker-icon");
    expect(markersBefore);

    (component.current as LeafletPublicMapAdapter).addMarker(new Placemark(0,0,'',''));

    let markersAfter = document.querySelectorAll(".leaflet-marker-icon");
    expect(markersAfter);
    expect(markersAfter.length > markersBefore.length);
})