import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import UserPage from '../../../components/social/UserPage';
import User from '../../../domain/User';
import Map from '../../../domain/Map';
import PODManager from '../../../adapters/solid/PODManager';
import Place from '../../../domain/Place';

const name = "test1";
const webID = "testWebID";
beforeEach(() => {
    let maps: Map[] = [];
    let map1 = new Map("Friends places", "https://testMap1");
    let map2 = new Map("Friends maps", "https://testMap2");
    jest.spyOn(PODManager.prototype, "getAllMaps").mockImplementation(async () => {
        return maps;
    })
    let places: Place[] = [];
    let place1 = new Place("test1", 0, 0, "testDescription1", [], "", "Cat1");
    let place2 = new Place("test2", 0, 0, "testDescription2", [], "", "Cata2");
    jest.spyOn(PODManager.prototype, "getAllUserPlaces").mockImplementation(async () => {
        return places;
    });
})

test('The UserPage component is rendering correctly', async () => {
    const {getByText} = render(<UserPage user={new User(name, webID)} />)
    await waitFor(() => {
        expect(getByText("test1")).toBeInTheDocument();
        const elements = screen.getAllByText("Link");
        expect(elements.length).toBe(2);
        const elements2 = screen.getAllByText("Description");
        expect(elements2.length).toBe(2);
        expect(getByText("test1's Places")).toBeInTheDocument();
        expect(getByText("test1's Maps")).toBeInTheDocument();
    })
});