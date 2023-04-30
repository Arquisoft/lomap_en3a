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

test('The page renders properly', async () => {

    const {getByText} = render(<Social/>);
    expect(getByText("My Friends")).toBeInTheDocument()
    expect(getByText("My Groups")).toBeInTheDocument()

});
