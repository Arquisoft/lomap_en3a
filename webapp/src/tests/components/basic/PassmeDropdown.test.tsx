import React from 'react';
import PassmeDropdown from "../../../components/basic/PassmeDropdown";
import {fireEvent, render} from "@testing-library/react";


test('The dropdown renders properly and its button shows the desired component', () => {
    const represented = (<section><h1>Test Dropdown</h1></section>);
    const {getByText} = render(<PassmeDropdown presentMe={represented} buttonText={"TestClick"}
                                               tooltip={"TestTooltip"}/>)
    expect(getByText("TestClick")).toBeInTheDocument();
    const button = getByText("TestClick");
    fireEvent.click(button);
    expect(getByText("Test Dropdown")).toBeInTheDocument();
    // TODO could do a jest.spyOnHandleClose to have been called
});