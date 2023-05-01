import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import FriendManager from '../../adapters/solid/FriendManager';
import User from '../../domain/User';
import SolidSessionManager from '../../adapters/solid/SolidSessionManager';
import PrivacyComponent from '../../components/place/PrivacyComponent';

const latitude = 0.2;
const longitude = 0.9;
const title = "Test";
const category = "Test";

beforeEach(() => {
    jest.spyOn(SolidSessionManager.prototype, "isLoggedIn").mockImplementation(() => {
        return true;
    })
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "https://testID";
    })
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(() => {
        let friendsList = new Array<User>();
        const user1 = new User("testFriend1", "https://testFriend1");
        const user2 = new User("testFriend2", "https://testFriend2");
        friendsList.push(user1);
        friendsList.push(user2);
        return Promise.resolve(friendsList);
    });
})

/*
    JEST test for testing if the PrivacyComponent is rendered correctly.
    First, the PrivacyComponent is rendered.
    the radiobutton for Public and Private and the checkbox Share with friends are expected to be in the document.
    Then, the Share with friends checkbox is selected.
    The friends from the friendsList are expected to have a checkbox each one.
*/
test('The PrivacyComponent is rendered correctly', async () => {
    const {getByText} = render(<PrivacyComponent updatePrivacy={() => {}}/>)
    await waitFor(() => {
        const buttonPublic = screen.getByRole("radio", {name: "Public"});
        expect(buttonPublic).toBeInTheDocument();
        const buttonPrivate = screen.getByRole("radio", {name: "Private"});
        expect(buttonPrivate).toBeInTheDocument();
        const buttonShare = screen.getByRole("checkbox", {name: "Share with friends"});
        expect(buttonShare).toBeInTheDocument();
        fireEvent.click(buttonShare);
        const friend1 = screen.getByRole("checkbox", {name: "testFriend1"});
        expect(friend1).toBeInTheDocument();
    })
});