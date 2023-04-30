
import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import AddPlace from "../place/AddPlace";
import Placemark from '../../domain/Placemark';
import SolidSessionManager from '../../adapters/solid/SolidSessionManager';
import FriendManager from '../../adapters/solid/FriendManager';
import User from '../../domain/User';

const latitude = 0.2;
const longitude = 0.9;
const title = "Test";
const category = "Test";

beforeAll(() => {
    // As the session manager uses fetching functions
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

test('The AddPlace component is rendering correctly', async () => {
    const {getByText} = render(<AddPlace open={true} placemark={new Placemark(latitude, longitude)} />)
    await waitFor(() => {
        expect(getByText("Fill the information of the new place.")).toBeInTheDocument();
        expect(getByText("Name:")).toBeInTheDocument();
        expect(getByText("Category:")).toBeInTheDocument();
        expect(getByText("Description:")).toBeInTheDocument();
        expect(getByText("Photo:")).toBeInTheDocument();
        expect(getByText("Submit")).toBeInTheDocument();
    })
});

/*
    JEST test for testing if it can be written inside the fields of the form.
    First, the input of type "text", name "name", placeholder "Name" is selected.
    Then, the text "Test" is written inside the input.
    Finally, the text "Test" is expected to be inside the input.

    The same process is repeated for the rest of the fields: the description textarea,
    the category select and the photo input.
*/
test('The AddPlace component is working as expected', async () => {
    const {getByText} = render(<AddPlace open={true} placemark={new Placemark(latitude, longitude)} />)
    await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'Test' } });
        expect(nameInput.value).toBe('Test');

        const descriptionTextarea = screen.getByPlaceholderText('Introduce a description') as HTMLTextAreaElement;
        fireEvent.change(descriptionTextarea, { target: { value: 'Test' } });
        expect(descriptionTextarea.value).toBe('Test');
    })
});