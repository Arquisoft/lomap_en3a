import React from 'react'
import {fireEvent, render} from "@testing-library/react";
import PointInformation from '../../pages/PointInformation';
import Place from '../../domain/Place';
import Map from "../../domain/Map";
import Placemark from '../../domain/Placemark';

test('check that the list of users renders propertly', async () => {
    const point: Place = new Place("Test", 100, 100, "Test", new Array(), undefined, "");
    const map: Map = new Map("Test Map");
    const {getByText} = render(<PointInformation placemark={new Placemark(0,0)} map={map}></PointInformation>);
    // We click the Reviews button
    const button = getByText("Reviews");
    fireEvent.click(button);
    // We should see the comments and Average Rating
    expect(getByText("Comments")).toBeInTheDocument();
    expect(getByText("AverageRating")).toBeInTheDocument();
});