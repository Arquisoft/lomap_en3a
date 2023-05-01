import React from 'react';
import {render, waitFor} from "@testing-library/react";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import Social from "../../pages/Social";
import SolidSessionManager from '../../adapters/solid/SolidSessionManager';
import PODManager from "../../adapters/solid/PODManager";
import Group from "../../domain/Group";
// To prevent crypto error
const crypto = require('crypto');

Object.defineProperty(globalThis, 'crypto', {
    value: {
        randomUUID: () => crypto.randomUUID()
    }
});

let users: User[];

beforeEach(() => {
    const groups = [new Group("GroupTest", []), new Group("GroupTest1", [])]
    jest.spyOn(SolidSessionManager.prototype, "isLoggedIn").mockImplementation(() => {
        return true;
    })
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "https://testID";
    })
    users = [new User("TestName1", "webId"), new User("TestName2", "webId2")];
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(async () => {
        return users;
    })
    jest.spyOn(PODManager.prototype, "getAllUserGroups").mockImplementation(async () => {
        return groups;
    });
})

test('The page renders properly', async () => {

    const {getByText} = render(<Social/>);
    await waitFor(() => {
        expect(getByText("My Friends")).toBeInTheDocument();
        expect(getByText("My Groups")).toBeInTheDocument();
    })

});

test('The page renders properly with a list of users', async () => {

    const {getByText} = render(<Social/>);
    await waitFor(() => {
        expect(getByText("TestName1")).toBeInTheDocument();
        expect(getByText("TestName2")).toBeInTheDocument();
    })

});

test('The page renders properly with a list of groups', async () => {

    const {getByText} = render(<Social/>);
    await waitFor(() => {
        expect(getByText("GroupTest")).toBeInTheDocument();
        expect(getByText("GroupTest1")).toBeInTheDocument();
    })

});
