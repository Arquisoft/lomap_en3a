import React from 'react';
import {fireEvent, getByText, render, screen} from '@testing-library/react';
import NavMenu from "../../components/NavMenu";
import {BrowserRouter} from "react-router-dom";

test('nav menu is rendered', () => {
    render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOptionText = screen.getByText("Home");
    expect(homeOptionText).toBeInTheDocument();
    const myPlacesOptionText = screen.getByText("My Stuff");
    expect(myPlacesOptionText).toBeInTheDocument();
    const friendsOptionText = screen.getByText("Social");
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
    const homeOption = getByText(container,"My Stuff");
    fireEvent.click(homeOption);
    expect(window.location.pathname).toBe("/stuff")
});

test('choose friends option', () => {
    const {container} = render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOption = getByText(container,"Social");
    fireEvent.click(homeOption);
    expect(window.location.pathname).toBe("/social")
});

test('choose friends option', () => {
    const {container} = render(<BrowserRouter><NavMenu /></BrowserRouter>);
    const homeOption = getByText(container,"Public map");
    fireEvent.click(homeOption);
    expect(window.location.pathname).toBe("/map/public")
});