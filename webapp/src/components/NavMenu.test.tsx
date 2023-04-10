import React from 'react';
import {fireEvent, getByText, render, screen} from '@testing-library/react';
import NavMenu from "./NavMenu";
import {BrowserRouter} from "react-router-dom";

test('renders nav menu', () => {
    render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOptionText = screen.getByText("Home");
    expect(homeOptionText).toBeInTheDocument();
    const myPlacesOptionText = screen.getByText("My places");
    expect(myPlacesOptionText).toBeInTheDocument();
    const friendsOptionText = screen.getByText("Friends");
    expect(friendsOptionText).toBeInTheDocument();
    const publicMapOptionText = screen.getByText("Public map");
    expect(publicMapOptionText).toBeInTheDocument();
});


test('choose home option', () => {
    const {container} = render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOption = getByText(container,"Home");
    fireEvent.click(homeOption);
    expect(window.location.pathname).toBe("/home")
});

test('choose my places option', () => {
    const {container} = render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOption = getByText(container,"My places");
    fireEvent.click(homeOption);
    expect(window.location.pathname).toBe("/map/personal")
});

test('choose friends option', () => {
    const {container} = render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOption = getByText(container,"Friends");
    fireEvent.click(homeOption);
    expect(window.location.pathname).toBe("/friends")
});

test('choose friends option', () => {
    const {container} = render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOption = getByText(container,"Public map");
    fireEvent.click(homeOption);
    expect(window.location.pathname).toBe("/map/public")
});