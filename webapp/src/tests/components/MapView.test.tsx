import {PlaceCategory} from "../../domain/place/PlaceCategory";
import {act, fireEvent, getByText, render, screen, waitFor} from "@testing-library/react";
import MapFilter from "../../components/MapFilter";
import React from "react";
import PODManager from "../../adapters/solid/PODManager";
import Map from "../../domain/Map";
import Placemark from "../../domain/Placemark";
import MapView from "../../pages/MapView";

beforeAll(() => {
    jest.spyOn(PODManager.prototype, "getAllMaps").mockImplementation(async (user: string | undefined) => {
        return [new Map("myMap")];
    })
    jest.spyOn(PODManager.prototype, "loadPlacemarks").mockImplementation(async (map: Map, author: string | undefined) => {
        map.setPlacemarks([new Placemark(0,0)]);
    })
});

test('The page renders correctly', async () => {
    render(<MapView/>)
    await waitFor(() => {
        expect(document.querySelector(".map-header")).not.toBeNull();
    });
});

test('A message is displayed if the user doesnt have maps', async () => {
    jest.spyOn(PODManager.prototype, "getAllMaps").mockImplementationOnce(async (user: string | undefined) => {
        return [];
    })
    render(<MapView/>)
    await waitFor(() => {
        expect(getByText(document.body, "You don't have any map!")).not.toBeUndefined();
    });
});

