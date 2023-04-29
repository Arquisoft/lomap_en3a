import React from 'react';
import {render, waitFor} from '@testing-library/react';
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import ListUsers from "../social/ListUsers";

test('The list of users renders one user correctly', async () => {
    const fm = new FriendManager();
    const users = [new User("TestName1", "webId"), new User("TestName2", "webId2")];
    let spy = jest.spyOn(fm, "getFriendsList").mockImplementation(async () => {
        return users;
    })
    const {getByText} = render(<ListUsers fm={fm} callback={() => {
    }}/>)

    await waitFor(() => {
        expect(getByText("TestName1")).toBeInTheDocument();
    })
});

/**
 test('The list of users calls the getUsers method at least once', async () => {
    const fm = new FriendManager();
    const users = [new User("TestName1", "webId"), new User("TestName2", "webId2")];
    let spy = jest.spyOn(fm, "getFriendsList").mockImplementation(async () => {
        return users;
    })
    const userList = shallow(<ListUsers fm={} callback={} />)
    const {getByText} = render(<ListUsers fm={fm} callback={() => {
    }}/>)

    const getUsers = jest.spyOn(userList, "getUsers")
});
 **/