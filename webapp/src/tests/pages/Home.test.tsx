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
})

test('Check that the Home components are renderized', async () => {
    document.querySelector("section")
    document.querySelector("LeafletMapAdapter")
    document.querySelector("PassmeDropdown")
    document.querySelector("map-options")

    expect(document.querySelector(".Home")).toBeInTheDOM()
    expect(document.querySelector("LeafletMapAdapter")).toBeInTheDOM()
    expect(document.querySelector("PassmeDropdown")).toBeInTheDOM()
    expect(document.querySelector("map-options")).toBeInTheDOM()
});

// describe('Home', () => {
//     it('should render the component', () => {
//         const component = shallow(<Home />);
//         expect(component.exists()).toBe(true);
//     });
//
//     it('should set the state correctly in the constructor', () => {
//         const placeList = [
//             {latitude: 40.712776, longitude: -74.005974, title: 'New York'},
//             {latitude: 51.507351, longitude: -0.127758, title: 'London'}
//         ];
//         const component = shallow(<Home placeList={placeList} />);
//         const expectedState = {
//             data: expect.any(Object),
//             filter: undefined,
//             maps: []
//         };
//         expect(component.state()).toEqual(expectedState);
//     });
//
//     it('should call loadPlacemarks and update the state when the map is changed', async () => {
//         const podManagerMock = {
//             createFriendsGroup: jest.fn(),
//             getAllMaps: jest.fn().mockResolvedValue([
//                 {getId: () => 'map1', getName: () => 'Map 1'},
//                 {getId: () => 'map2', getName: () => 'Map 2'}
//             ]),
//             loadPlacemarks: jest.fn().mockResolvedValue(true)
//         };
//         const component = shallow(<Home />);
//         component.instance().podManager = podManagerMock;
//         const event = {target: {value: 'map2', selectedIndex: 1}};
//         await component.instance().changeMap(event);
//         expect(podManagerMock.loadPlacemarks).toHaveBeenCalledWith({getId: expect.any(Function)});
//         expect(component.state('data')).toEqual({getId: expect.any(Function)});
//     });
//
//     it('should update the state correctly when the filter is set', () => {
//         const component = shallow(<Home />);
//         const categories = ['category1', 'category2'];
//         component.instance().setFilter(categories);
//         expect(component.state('filter')).toEqual(categories);
//     });
// });