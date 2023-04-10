import React from 'react';
import { render, screen } from '@testing-library/react';
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
    const publicMapOptionText = screen.getByText("Friends");
    expect(publicMapOptionText).toBeInTheDocument();
});