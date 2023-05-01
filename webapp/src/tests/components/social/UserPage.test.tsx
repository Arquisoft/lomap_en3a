import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import UserPage from '../../../components/social/UserPage';
import User from '../../../domain/User';

const name = "test1";
const webID = "testWebID";

beforeAll(() => {
    // As the session manager uses fetching functions
})

test('The UserPage component is rendering correctly', async () => {
    const {getByText} = render(<UserPage user={new User(name, webID)} />)
    await waitFor(() => {
        expect(getByText("test1")).toBeInTheDocument();
        expect(getByText("Friends places")).toBeInTheDocument();
        expect(getByText("Friends maps")).toBeInTheDocument();
        expect(getByText("Link")).toBeInTheDocument();
        expect(getByText("Information")).toBeInTheDocument();
    })
});