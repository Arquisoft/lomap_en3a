import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import {UserMenu} from "../../components/UserMenu";
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";

beforeEach(() => {
    // As the session manager uses fetching functions
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "testWebId"
    })
})

test('The components renders correctly', () => {
    render(<UserMenu/>)
    // The icon of the user should be appearing
    const icon = document.querySelector("svg");
    expect(icon != null);
});

test('When the profile is clicked, the options are displayed', () => {
    const {getByAltText} = render(<UserMenu/>)
    // We click the user icon, the dropdown should appear
    const icon = document.querySelector(".Dropdown");
    expect(icon != null);
    waitFor(() => {
        if (icon != null) {
            fireEvent.click(icon);
            expect(getByAltText("My profile")).toBeInTheDocument();
            expect(getByAltText("Log out")).toBeInTheDocument();
        }
    })
});
