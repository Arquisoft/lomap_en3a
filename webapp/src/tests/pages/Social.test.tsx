import React from 'react';
import {render, waitFor} from "@testing-library/react";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import Social from "../../pages/Social";

let users: User[];

beforeAll(() => {
    users = [new User("TestName1", "webId"), new User("TestName2", "webId2")];
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(async () => {
        return users;
    })
})

test('The page renders properly with a set of users', async () => {

    const {getByText} = render(<Social/>);
    expect(getByText("Friends list")).toBeInTheDocument()
    await waitFor(() => {
        expect(getByText("TestName1")).toBeInTheDocument();
        expect(getByText("TestName2")).toBeInTheDocument();
    });

});
