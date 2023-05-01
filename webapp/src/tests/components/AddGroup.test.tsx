import React from 'react';
import {render, waitFor} from '@testing-library/react';
import FriendManager from '../../adapters/solid/FriendManager';
import User from '../../domain/User';
import AddGroup from "../../components/social/AddGroup";
import crypto from "crypto";

Object.defineProperty(globalThis, 'crypto', {
    value: {
        randomUUID: () => crypto.randomUUID()
    }
});

beforeEach(() => {
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(() => {
        const user1 = new User("test1", "https://testFriend1");
        const user2 = new User("test2", "https://testFriend2");
        let users = new Array<User>();
        users.push(user1);
        users.push(user2);
        return Promise.resolve(users);
    })
})

test('The AddGroup component is rendering correctly', async () => {
    const {getByText} = render(<AddGroup />)
    await waitFor(() => {
        expect(getByText("New Group")).toBeInTheDocument();
        expect(getByText("Select the friends to add")).toBeInTheDocument();
        expect(getByText("Create")).toBeInTheDocument();
        expect(getByText("test1")).toBeInTheDocument();
        expect(getByText("test2")).toBeInTheDocument();
    });
});

// test('The AddGroup component is working as expected', async () => {
//     const {container, getByText} = render(<AddGroup/>)
//     await waitFor(() => {
//         const optionCheckBox = container.querySelector('input[type = "checkbox"]')! as HTMLInputElement
//         const textFieldGroupName = container.querySelector('input[name = "group-name"]')!
//         userEvent.type(textFieldGroupName, "testGroup");
//         if (optionCheckBox != null) {
//             optionCheckBox.checked = true;
//         }
//         fireEvent.click(getByText("Create"))
//     });
//     await waitFor(() => {
//         expect(getByText("Done!")).toBeInTheDocument();
//     })
//
// });