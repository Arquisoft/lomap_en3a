import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import OverviewPage from "../../../components/place/OverviewPage";
import Place from "../../../domain/Place";
import PODManager from "../../../adapters/solid/PODManager";
import SolidSessionManager from "../../../adapters/solid/SolidSessionManager";

beforeEach(() => {
    jest.spyOn(PODManager.prototype, "comment").mockImplementation(async () => {
        return;
    });
    jest.spyOn(PODManager.prototype, "review").mockImplementation(async () => {
        return;
    });
    jest.spyOn(PODManager.prototype, "addImage").mockImplementation(async () => {
        return;
    });
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "test";
    });
});

test('The overview place shows an image when uploaded', () => {
    const place = new Place("TestPlace", 0, 0, "DecriptionTest", [new File(["\"C:\\\\Users\\\\guill\\\\Documents\\\\Uni\\\\LoMap\\\\webapp\\\\public\\\\marker_black.png\""], "file")], undefined, "q");
    const {getByText} = render(<OverviewPage place={place} placeUrl={"madeUpURL"}/>)
    waitFor(() => {
        const image = document.querySelector("img");
        expect(image != null);
    })
});

test('The overview place can submit a comment', () => {
    const place = new Place("TestPlace", 0, 0, "DecriptionTest", [], undefined, "q");
    render(<OverviewPage place={place} placeUrl={"madeUpURL"}/>)
    waitFor(() => {
        const textarea = document.querySelector("textarea[id='comment']") as HTMLInputElement;
        const submitComment = document.querySelector("button[value='Publish a comment']") as HTMLButtonElement;
        // The textarea and the button exist
        expect(textarea != null && submitComment != null)
        if (textarea != null && submitComment != null) {
            // Fill the comment
            textarea.value = "Comment";
            expect(textarea.value === "Comment");
            fireEvent.click(submitComment);
            expect(textarea.value === "");
        }
    })
});

test('The overview place shows an error when the comment is empty', () => {
    const place = new Place("TestPlace", 0, 0, "DecriptionTest", [], undefined, "q");
    const {getByText} = render(<OverviewPage place={place} placeUrl={"madeUpURL"}/>)
    waitFor(() => {
        const textarea = document.querySelector("textarea[id='comment']") as HTMLInputElement;
        const submitComment = document.querySelector("button[value='Publish a comment']") as HTMLButtonElement;
        // The textarea and the button exist
        expect(textarea != null && submitComment != null)
        if (textarea != null && submitComment != null) {
            // Submit the comment without text
            fireEvent.click(submitComment);
            expect(getByText("You must enter a comment.")).toBeInTheDocument();
        }
    })
});