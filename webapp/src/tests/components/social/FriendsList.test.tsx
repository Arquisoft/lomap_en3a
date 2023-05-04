import React from 'react';
import {render} from '@testing-library/react';
import User from "../../../domain/User";
import FriendsList from "../../../components/social/FriendsList";

test('The friends list renders properly with a set of friends', () => {

    let user1 = new User("TestUser", "TestID");
    user1.note = "Hello World";
    user1.organization = "Organization Test";
    let user2 = new User("TestUser2", "TestID2");
    user2.note = "Hello Second World";
    user2.organization = "EVIL Corp";
    const users: User[] = [user1, user2];
    const {getByText} = render(<FriendsList users={users}/>)

    expect(getByText("TestUser")).toBeInTheDocument();
    expect(getByText("- Hello World")).toBeInTheDocument();
    expect(getByText("Organization Test")).toBeInTheDocument();
    expect(getByText("TestUser2")).toBeInTheDocument();
    expect(getByText("- Hello Second World")).toBeInTheDocument();
    expect(getByText("EVIL Corp")).toBeInTheDocument();
});