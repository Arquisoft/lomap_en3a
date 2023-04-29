import React from 'react';
import {render} from '@testing-library/react';
import NewPlacePopup from "../NewPlacePopup";


test('The new place popup is rendering correctly', () => {
    const {getByText} = render(<NewPlacePopup new={() => {
    }} cancel={() => {
    }}/>)
    expect(getByText("New...")).toBeInTheDocument();
    expect(getByText("Cancel")).toBeInTheDocument();
});