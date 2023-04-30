import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import MapFilter from '../../components/MapFilter';
import {PlaceCategory} from '../../domain/Place/PlaceCategory';
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";

let users: User[];
let categories: string[];
let callback: () => void;

beforeAll(() => {
    categories = Object.keys(PlaceCategory);
    callback = () => {
    };
    users = [new User("TestName1", "webId"), new User("TestName2", "webId2")];
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(async () => {
        return users;
    });
});

test('When the MapFilter renders, all the categories are shown', () => {
    const {getByText} = render(<MapFilter callback={() => {
    }}/>);
    for (const i in categories) {
        expect(getByText(categories[i])).toBeInTheDocument();
    }
});

test('When the submit button is clicked, the callback method is executed', () => {
    render(<MapFilter callback={callback}/>);
    // We get the submit button
    const buttonSubmit = document.querySelector("button[type='sumbmit']");
    expect(buttonSubmit != null);
    if (buttonSubmit != null) {
        fireEvent.click(buttonSubmit);
        expect(callback).toHaveBeenCalled();
    }
});

/**
 test('When a checkbox is clicked, the checkbox handler method is called', () => {
    const filter = new MapFilter({callback: callback});

    render(filter.render());

    const mockedHandler = jest.spyOn(filter, "handleCategoryChange").mockImplementation(jest.fn());

    const checkbox = document.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(checkbox != null);
    if (checkbox != null) {
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
        expect(mockedHandler).toHaveBeenCalled();
    }
 });
 **/


