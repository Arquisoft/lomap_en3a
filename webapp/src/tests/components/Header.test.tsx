import React from 'react';
import {render, screen} from '@testing-library/react';
import Header from "../../components/Header";
import {BrowserRouter} from "react-router-dom";

test('header is rendered', () => {
    render(<BrowserRouter><Header /></BrowserRouter>);
    const homeOptionText = screen.getByText("LoMap");
    expect(homeOptionText).toBeInTheDocument();
});