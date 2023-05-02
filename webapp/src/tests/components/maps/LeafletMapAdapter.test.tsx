import React from 'react';
import {findAllByRole, fireEvent, getByRole, getByText, render, waitFor} from '@testing-library/react';
import LeafletMapAdapter from "../../../adapters/map/LeafletMapAdapter";
import PODManager from "../../../adapters/solid/PODManager";
import Placemark from "../../../domain/Placemark";
import Map from "../../../domain/Map";

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
    let marker = getNewPlacemark();
    expect(marker.getAttribute("src")?.startsWith("/static/media"));
});

test('The cancel button of the popup removes the marker', async () => {
    let marker = getNewPlacemark();
    fireEvent.click(marker);
    const cancelButton = getByText(document.body, "Cancel")
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(getByText(document.body, "Cancel"));
    expect(cancelButton).not.toBeInTheDocument();
});

test('The "new" button of the popup shows the add place page', async () => {
    let marker = getNewPlacemark();
    fireEvent.click(marker);
    fireEvent.click(getByText(document.body, "New..."));
    await waitFor(() => {
        expect(getByText(document.body,"Fill the information of the new place."));
        fireEvent.click(document.querySelector(".MuiModalClose-root") as Element);
    });
    await waitFor(() => {
        let map = document.querySelector(".leaflet-container") as Element;
        expect(map).toBeInTheDocument()
    });
})

test('The map is filtered by category', async () => {
    let placemarks = [
        new Placemark(0, 0, "", "", "park"),
        new Placemark(1, 1, "", "", "park"),
        new Placemark(2, 2, "", "", "bar"),
        new Placemark(3, 3, "", "", "restaurant"),
        new Placemark(4, 4, "", "", "hotel")
    ];
    let mapObject = new Map("","");
    mapObject.setPlacemarks(placemarks);
    render(<LeafletMapAdapter map={mapObject} categories={["park", "hotel"]} />);

    let markers = document.querySelector("div.leaflet-pane:nth-child(4)");
    let images = (markers as Element).getElementsByTagName("img");
    expect(images.length == 3);
});

function getNewPlacemark() {
    // Click on the map
    render(<LeafletMapAdapter/>);
    let map = document.querySelector(".leaflet-container") as Element;
    fireEvent.click(map);

    // Get markers
    let markers = document.querySelector("div.leaflet-pane:nth-child(4)");
    expect(markers);
    let images = (markers as Element).getElementsByTagName("img");

    // Check that the custom marker is present
    expect(images.length > 0);
    return images[images.length - 1];
}
