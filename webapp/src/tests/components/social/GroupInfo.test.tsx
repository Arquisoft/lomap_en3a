import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import UserPage from '../../../components/social/UserPage';
import User from '../../../domain/User';
import GroupInfo from '../../../components/social/GroupInfo';
import Group from '../../../domain/Group';
import PODManager from '../../../adapters/solid/PODManager';
import Map from '../../../domain/Map';

const name = "test";
const name1 = "test1";
const webID1 = "testWebID1";
const name2 = "test2";
const webID2 = "testWebID2";
const testUser1 = new User(name1, webID1);
const testUser2 = new User(name2, webID2);
const members = [testUser1, testUser2];

let maps = new Array<Map>();
const map1 = new Map("Friends places", "https://testMap1");
const map2 = new Map("Friends maps", "https://testMap2");
maps.push(map1);
maps.push(map2);

beforeEach(() => {
})

test('The UserPage component is rendering correctly', async () => {
    jest.spyOn(PODManager.prototype, "getGroupMaps").mockImplementation(async (group) => {
        return Promise.resolve(maps);
    })
    const {getByText} = render(<GroupInfo group={new Group(name, members)}/>)
    await waitFor(() => {
        expect(getByText("test")).toBeInTheDocument();
        expect(getByText("Number of members: 2")).toBeInTheDocument();
        //Now we should check that the count of elements that have "Friends places" are two
        const elements = getByText("Friends places");
        expect(elements).toBeInTheDocument();
        const elementsM = getByText("Friends maps");
        expect(elementsM).toBeInTheDocument();
    })
});

test('The UserPage component is rendering correctly', async () => {
    // As the session manager uses fetching functions
    jest.spyOn(PODManager.prototype, "getGroupMaps").mockImplementation(async (group) => {
        return [];
    })

    const {getByText} = render(<GroupInfo group={new Group(name, members)}/>)
    await waitFor(() => {
        expect(getByText("test")).toBeInTheDocument();
        expect(getByText("Number of members: 2")).toBeInTheDocument();
    })
});