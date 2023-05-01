import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import UserPage from '../../../components/social/UserPage';
import User from '../../../domain/User';

const latitude = 0.2;
const longitude = 0.9;
const title = "Test";
const category = "Test";

beforeAll(() => {
    // As the session manager uses fetching functions
})

test('The UserPage component is rendering correctly', async () => {
    const {getByText} = render(<UserPage user={new User("test1", "testWebID")} />)
    await waitFor(() => {
        expect(getByText("test1")).toBeInTheDocument();
        expect(getByText("Friends places")).toBeInTheDocument();
        expect(getByText("Friends maps")).toBeInTheDocument();
        expect(getByText("Link")).toBeInTheDocument();
        expect(getByText("Information")).toBeInTheDocument();
    })
});

/*
    JEST test for testing if it can be written inside the fields of the form.
    First, the input of type "text", name "name", placeholder "Name" is selected.
    Then, the text "Test" is written inside the input.
    Finally, the text "Test" is expected to be inside the input.

    The same process is repeated for the rest of the fields: the description textarea,
    the category select and the photo input.
*/
