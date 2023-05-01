import React from 'react';
import {fireEvent, getByText, render, screen} from '@testing-library/react';

test('logout button is rendered', () => {
    // render(<EmptyList/>);
    const homeOptionText = screen.getByAltText("A comically placed image with a comically placed alt text");
    expect(homeOptionText).toBeInTheDocument();
});