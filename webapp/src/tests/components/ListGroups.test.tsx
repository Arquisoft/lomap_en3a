import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import {UserMenu} from "../../components/UserMenu";
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
import ListGroups from "../../components/social/ListGroups";
import User from "../../domain/User";
import PODManager from "../../adapters/solid/PODManager";
import Group from "../../domain/Group";
import {Simulate} from "react-dom/test-utils";


beforeEach(() => {
    // As the session manager uses fetching functions
    jest.spyOn(PODManager.prototype, "getAllUserGroups").mockImplementation(async ():  Promise<Group[]> => {
        const user1 = new User("test1", "https://testFriend1");
        const user2 = new User("test2", "https://testFriend2");
        let users = new Array<User>();
        users.push(user1);
        users.push(user2);
        let groups = new Array<Group>();
        groups.push(new Group("testGroup", users));

        return Promise.resolve(groups);
    })
})

test('The group list renders correctly', async () => {
    const {getByText} = render(<ListGroups user={new User("TestName1", "webId")} callback={jest.fn()}/>)
    await waitFor(() => {
        expect(getByText("Group name")).toBeInTheDocument();
        expect(getByText("Link")).toBeInTheDocument();
        expect(getByText("testGroup")).toBeInTheDocument();
        expect(getByText("See info")).toBeInTheDocument();
    })
});
