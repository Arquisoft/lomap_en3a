import React from 'react'
import {fireEvent, render} from "@testing-library/react";
import PointInformation from '../../pages/PointInformation';
import Place from '../../domain/Place';
import Map from "../../domain/Map";

test('Check that when I change the view of the Place Info the review is shown', async () => {
    const point: Place = new Place("Test", 100, 100, "Test", [], "testId", "test");
    const map: Map = new Map("Test Map", "Test");
    const {getByText} = render(<PointInformation point={point} map={map}></PointInformation>);
    // We click the Reviews button
    const button = getByText("Reviews");
    fireEvent.click(button);
    // We should see the comments and Average Rating lines
    expect(getByText("Comments")).toBeInTheDocument();
    expect(getByText("Average Rating")).toBeInTheDocument();
});

test('Check that when I change the view of the Place Info the overview is shown', async () => {
    const point: Place = new Place("Test", 100, 100, "Test", [], "testId", "test");
    const map: Map = new Map("Test Map", "Test");
    const {getByText} = render(<PointInformation point={point} map={map}></PointInformation>);
    // We click the Reviews button
    const button = getByText("Reviews");
    fireEvent.click(button);
    // We go back to the Overview
    const button2 = getByText("Overview");
    fireEvent.click(button2);
    // We should see the Overview page now
    expect(getByText("Publish a comment")).toBeInTheDocument();
    expect(getByText("Submit a review")).toBeInTheDocument();
});