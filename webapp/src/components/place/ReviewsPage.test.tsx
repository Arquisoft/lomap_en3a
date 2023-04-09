import React from 'react'
import {fireEvent, render} from "@testing-library/react";
import PointInformation from '../../pages/PointInformation';
import Place from '../../domain/Place';
import Map from "../../domain/Map";

test('check that the list of users renders propertly', async () => {
    const point: Place = new Place("Test", 100, 100, "Test", new Array(), "");
    const map: Map = new Map();
    const {getByText} = render(<PointInformation point={point} map={map}></PointInformation>);
    // We click the Reviews button
    const button = getByText("Reviews");
    fireEvent.click(button);
    // We should see the comments and Average Rating
    expect(getByText("Comments")).toBeInTheDocument();
    expect(getByText("AverageRating")).toBeInTheDocument();
});