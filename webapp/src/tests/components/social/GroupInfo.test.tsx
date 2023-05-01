import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import UserPage from '../../../components/social/UserPage';
import User from '../../../domain/User';
import GroupInfo from '../../../components/social/GroupInfo';
import Group from '../../../domain/Group';

const name = "test";
const name1 = "test1";
const webID1 = "testWebID1";
const name2 = "test2";
const webID2 = "testWebID2";
const testUser1 = new User(name1, webID1);
const testUser2 = new User(name2, webID2);
const members = [testUser1, testUser2];


beforeAll(() => {
    // As the session manager uses fetching functions
})

test('The UserPage component is rendering correctly', async () => {
    const {getByText} = render(<GroupInfo group={new Group(name, members)} />)
    await waitFor(() => {
        expect(getByText("test1")).toBeInTheDocument();
        expect(getByText("Friends places")).toBeInTheDocument();
        expect(getByText("Friends maps")).toBeInTheDocument();
        expect(getByText("Link")).toBeInTheDocument();
        expect(getByText("Information")).toBeInTheDocument();
    })
});