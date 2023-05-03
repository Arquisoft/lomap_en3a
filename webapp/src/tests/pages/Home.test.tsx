import {wait} from "@testing-library/user-event/dist/utils";
import React from 'react';
import {act, fireEvent, getByLabelText, render, screen, waitFor} from "@testing-library/react";
import {Simulate} from "react-dom/test-utils";
import PODManager from "../../adapters/solid/PODManager";
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
import Home from "../../pages/Home";
import {PlaceType} from "../../types/PlaceType";
import Map from "../../domain/Map";
import Placemark from '../../domain/Placemark';
import waiting = Simulate.waiting;

let ref: any;
let placeListProt: PlaceType[];
let maps: Map[];

beforeEach(() => {
    placeListProt = [
        {uuid: "1", latitude: 40.712776, longitude: -74.005974, title: 'New York'},
        {uuid: "2", latitude: 51.507351, longitude: -0.127758, title: 'London'}
    ];

    maps = [new Map("Map1", "Mapt test", "1"),
        new Map("Map2", "Mapt test", "2")]

    jest.spyOn(SolidSessionManager.prototype, "isLoggedIn").mockImplementation(() => {
        return true;
    })

    // Mocking the logic for getting the WebID
    jest.spyOn(PODManager.prototype, "loadPlacemarks").mockImplementation(async (map) => {
        let placeMarks;
        if (map.getName() == "Map1") {
            placeMarks = [
                new Placemark(40.712776, -74.005974),
                new Placemark(51.507351, -0.127758),
                new Placemark(21.507351, -2.127758),
                new Placemark(31.507351, -1.127758),
            ]
        } else {
            placeMarks = [
                new Placemark(40.712776, -74.005974)
            ]
        }
        map.setPlacemarks(placeMarks);
    });

    jest.spyOn(PODManager.prototype, "createFriendsGroup").mockImplementation(async () => {
    });

    jest.spyOn(PODManager.prototype, "getAllMaps").mockImplementation(async () => {
        return maps
    });

    ref = React.createRef<Home>()
    act(() => {
        render(<Home placeList={placeListProt} ref={ref}/>)
    })
})

test('Check that the Home page is renderized', async () => {
    const footer = screen.getByText("LoMap® is a software product developed by the lomap_en3a team")
    expect(footer).toBeInTheDocument()
    const title = screen.getByText("Public map")
    expect(title).toBeInTheDocument()
    const map = screen.getByText("Leaflet")
    expect(map).toBeInTheDocument()
});


test('The state should be correctly in the constructor', async () => {
    maps = [new Map("Public map"), ...maps]

    await waitFor(() => {
        expect(ref.current?.state.maps).toHaveLength(3);
        expect(ref.current?.state.maps).toContain(maps[1]);
        expect(ref.current?.state.maps).toContain(maps[2]);
    })
});

test('Load the placemarks and then change the map shown', async () => {
    fireEvent.change(document.querySelector("select") as HTMLSelectElement,
        {target: {value: "1"}})
    let marks
    await waitFor(() => {
        marks = document.querySelectorAll("img[alt='Marker']")
        expect(marks).toHaveLength(4)

    })

    fireEvent.change(document.querySelector("select") as HTMLSelectElement,
        {target: {value: "2"}})
    await waitFor(() => {
        marks = document.querySelectorAll("img[alt='Marker']")
        expect(marks).toHaveLength(1)
    })
});