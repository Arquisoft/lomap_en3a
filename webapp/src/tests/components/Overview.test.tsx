import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import Place from '../../domain/Place';
import OverviewPage from '../../components/place/OverviewPage';


const latitude = 0.2;
const longitude = 0.9;
const title = "Test";
const category = "Test";
const description = "TestDescription";

beforeAll(() => {
})

/*
    JEST test for testing if the PrivacyComponent is rendered correctly.
    First, the PrivacyComponent is rendered.
    the radiobutton for Public and Private and the checkbox Share with friends are expected to be in the document.
    Then, the Share with friends checkbox is selected.
    The friends from the friendsList are expected to have a checkbox each one.
*/
test('The PrivacyComponent is rendered correctly', async () => {
    const {getByText} = render(<OverviewPage place={new Place(title, 0, 0, description, [], "", "")} placeUrl={''}/>)
    await waitFor(() => {
        expect(getByText(description)).toBeInTheDocument();
        expect(getByText("Comment:")).toBeInTheDocument();
        expect(getByText("Rating:")).toBeInTheDocument();
        expect(getByText("Photo:")).toBeInTheDocument();

        const buttonComment = screen.getByRole("button", {name: "Publish a comment"}) as HTMLButtonElement;
        expect(buttonComment).toBeInTheDocument();

        const buttonReview = screen.getByRole("button", {name: "Submit a review"}) as HTMLButtonElement;
        expect(buttonReview).toBeInTheDocument();

        const buttonPhotos = screen.getByRole("button", {name: "Upload photos"}) as HTMLButtonElement;
        expect(buttonPhotos).toBeInTheDocument();
    })
});