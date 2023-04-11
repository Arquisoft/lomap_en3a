import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";
import LogoutButton from "../LogoutButton";

test('logout button is rendered', () => {
    render(<BrowserRouter><LogoutButton style = {{color: "blue"}} /></BrowserRouter>);
    const homeOptionText = screen.getByText("Log out");
    expect(homeOptionText).toBeInTheDocument();
});


test('click on logout', async () => {
    await act(() => {
        const {container} = render(<BrowserRouter><LogoutButton style = {{color: "blue"}} /></BrowserRouter>);
        fireEvent.click(container);
        expect(window.location.pathname).toBe("/")
    })
});