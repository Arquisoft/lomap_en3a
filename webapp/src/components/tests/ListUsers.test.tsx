import React from 'react';
import {render, waitFor} from '@testing-library/react';
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import ListUsers from "../social/ListUsers";

test('The list of users renders one user correctly and the method getUsers has been called', async () => {
    const fm = new FriendManager();
    const users = [new User("TestName1", "webId"), new User("TestName2", "webId2")];
    let spy = jest.spyOn(fm, "getFriendsList").mockImplementation(async () => {
        return users;
    })
    const {getByText} = render(<ListUsers fm={fm} callback={() => {
    }}/>)

    await waitFor(() => {
        expect(getByText("TestName1")).toBeInTheDocument();
        expect(spy).toHaveBeenCalled();
    })
});


test('The list of users shows a message when there are no friends on the list', async () => {
    const fm = new FriendManager();
    const users: User[] = [];
    let spy = jest.spyOn(fm, "getFriendsList").mockImplementation(async () => {
        return users;
    })

    const {getByText} = render(<ListUsers fm={fm} callback={() => {
    }}/>)

    await waitFor(() => {
        expect(getByText("Your friend list is empty!")).toBeInTheDocument();
        const testImage = document.querySelector("img") as HTMLImageElement;
        expect(testImage).toBeInTheDOM();
    })
});
