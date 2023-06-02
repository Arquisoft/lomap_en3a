import React from 'react';
import {
    fireEvent,
    getByPlaceholderText,
    render,
    waitFor,
    screen,
    getByText,
    act,
    findByText
} from '@testing-library/react';
import Place from '../../domain/Place';
import OverviewPage from '../../components/place/OverviewPage';
import PODManager from "../../adapters/solid/PODManager";
import PlaceComment from "../../domain/place/PlaceComment";
import PlaceRating from "../../domain/place/PlaceRating";


const latitude = 0.2;
const longitude = 0.9;
const title = "Test";
const category = "Test";
const description = "TestDescription";

beforeAll(() => {
    jest.spyOn(PODManager.prototype, "comment").mockImplementation(async (comment: PlaceComment, placeUrl: string) => {
        // Do nothing
    });
    jest.spyOn(PODManager.prototype, "review").mockImplementation(async (review: PlaceRating, placeUrl: string) => {
        // Do nothing
    });
    jest.spyOn(PODManager.prototype, "addImage").mockImplementation(async (image: File, placeUrl: string) => {
        // Do nothing
    });
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

test('Reviews are added correctly', async () => {
    let place = new Place("place", 0, 0, "", [], "", "");
    let ref = React.createRef<OverviewPage>();
    render(<OverviewPage place={place} placeUrl={"url"} ref={ref} />);
    let star = document.querySelector(".star-svg");
    expect(star).not.toBeNull();
    fireEvent.click(star as Element);
    let button = screen.getByRole("button", {name: "Submit a review"});
    fireEvent.click(button);
    await waitFor(() => {
        expect(getByText(document.body, "Done!")).not.toBeNull();
    })
});

/**
test('Review scores are updated correctly', async () => {
    let place = new Place("place", 0, 0, "", [], "", "");
    let ref = React.createRef<OverviewPage>();
    render(<OverviewPage place={place} placeUrl={"url"} ref={ref} />);
    await act (() => {
        ref.current?.handleInputRatingChange(5);
    })
    expect(ref.current?.state.rating).toBe(5);
});
**/
test('Show error message when submitting an empty comment', async () => {
    let place = new Place("place", 0, 0, "", [], "", "");
    let ref = React.createRef<OverviewPage>();
    render(<OverviewPage place={place} placeUrl={"url"} ref={ref} />);
    let comment = document.querySelector("#comment");
    expect(comment).not.toBeNull();
    let button = screen.getByRole("button", {name: "Publish a comment"});
    expect(button).not.toBeNull();
    fireEvent.click(button);
    expect(getByText(document.body, "You must enter a comment.")).toBeInTheDocument();
});

/**
test('Update the stored comment on text area change', async () => {
    let place = new Place("place", 0, 0, "", [], "", "");
    let ref = React.createRef<OverviewPage>();
    render(<OverviewPage place={place} placeUrl={"url"} ref={ref} />);
    let comment = document.querySelector("#comment") as HTMLTextAreaElement;
    expect(comment).not.toBeNull();
    fireEvent.change(comment, { target: { value: 'new comment' } });
    expect(ref.current?.state.comment).not.toBeUndefined();
});
 **/

test('Upload photos correctly', async () => {
    // Create page
    let place = new Place("place", 0, 0, "", [], "", "");
    let ref = React.createRef<OverviewPage>();
    render(<OverviewPage place={place} placeUrl={"url"} ref={ref} />);

    // Get elements
    let files = getByPlaceholderText(document.body, "Choose a photo");
    expect(files).not.toBeNull();
    const buttonPhotos = screen.getByRole("button", {name: "Upload photos"}) as HTMLButtonElement;
    expect(buttonPhotos).toBeInTheDocument();

    // Upload photos
    fireEvent.change(files as Element, { target: { files: [] } });
    fireEvent.click(buttonPhotos);
    let error = document.querySelector(".error") as HTMLSpanElement;
    expect(error.innerText).toBeUndefined()
});

test('Error shown when trying to upload no photos', async () => {
    // Create page
    let place = new Place("place", 0, 0, "", [], "", "");
    let ref = React.createRef<OverviewPage>();
    render(<OverviewPage place={place} placeUrl={"url"} ref={ref} />);

    // Get elements
    let files = getByPlaceholderText(document.body, "Choose a photo");
    expect(files).not.toBeNull();
    const buttonPhotos = screen.getByRole("button", {name: "Upload photos"}) as HTMLButtonElement;
    expect(buttonPhotos).toBeInTheDocument();

    // Upload no photos
    fireEvent.click(buttonPhotos);
    let error = getByText(document.body, "You must select at least one photo.");
    expect(error).toBeInTheDocument();
})