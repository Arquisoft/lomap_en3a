import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import MapInfo from '../../pages/MapInfo';
import Map from '../../domain/Map';
import Placemark from '../../domain/Placemark';
import SolidSessionManager from '../../adapters/solid/SolidSessionManager';
import FriendManager from '../../adapters/solid/FriendManager';
import User from '../../domain/User';
import PODManager from '../../adapters/solid/PODManager';

const map = new Map("TestMap", "TestDescription", "TestID");
const placemark1 = new Placemark(0.2, 0.9, "TestPlacemark1", "TestDescription1");
const placemark2 = new Placemark(0.2, 0.9, "TestPlacemark2", "TestDescription2");

beforeAll(() => {
    map.add(placemark1);
    map.add(placemark2);
    jest.spyOn(SolidSessionManager.prototype, "isLoggedIn").mockImplementation(() => {
        return true;
    });
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "https://testID/profile/card#me";
    });
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(() => {
        let friendsList = new Array<User>();
        const user1 = new User("testFriend1", "https://testFriend1");
        const user2 = new User("testFriend2", "https://testFriend2");
        friendsList.push(user1);
        friendsList.push(user2);
        return Promise.resolve(friendsList);
    });
    jest.spyOn(PODManager.prototype, "loadPlacemarks").mockImplementation((map) => {
        let placemarks = new Array<Placemark>();
        placemarks.push(placemark1);
        placemarks.push(placemark2);
        map.setPlacemarks(placemarks);
        return Promise.resolve();
    });
})

test('The AddPlace component is rendering correctly', async () => {
    const {getByText} = render(<MapInfo map={map}/>)
    await waitFor(() => {
        expect(getByText("TestMap")).toBeInTheDocument();
        expect(getByText("TestDescription")).toBeInTheDocument();
        expect(getByText("TestPlacemark1")).toBeInTheDocument();
        expect(getByText("TestPlacemark2")).toBeInTheDocument();

        const buttonSeeDetail = screen.getAllByText("See detail...");
        expect(buttonSeeDetail.length === 2).toBeTruthy();
    });
});