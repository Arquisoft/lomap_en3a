import React from 'react';
import {render, screen} from '@testing-library/react';
import EmptyList from "../../../components/basic/EmptyList";

test('an empty list is rendered', () => {
    render(<EmptyList firstHeader={"Header"} image={"image"} secondHeader={"Second header"}/>);
    const homeOptionText = screen.getByAltText("A comically placed image with a comically placed alt text");
    expect(homeOptionText).toBeInTheDocument();
});