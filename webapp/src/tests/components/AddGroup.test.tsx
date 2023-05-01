import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import FriendManager from '../../adapters/solid/FriendManager';
import User from '../../domain/User';
import AddGroup from "../../components/social/AddGroup";


jest.mock("../../adapters/solid/FriendManager")

beforeAll(() => {
    const users = [new User("TestName1", "webId"), new User("TestName2", "webId2")];
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(async () => {
        return users;
    })
})

test('The AddGroup component is rendering correctly', async () => {
    const {getByText} = render(<AddGroup />)
    await waitFor(() => {
        expect(getByText("New Group")).toBeInTheDocument();
        expect(getByText("Select the friends to add")).toBeInTheDocument();
        expect(getByText("Create")).toBeInTheDocument();
    })
});

/*
    JEST test for testing if it can be written inside the fields of the form.
    First, the input of type "text", name "name", placeholder "Name" is selected.
    Then, the text "Test" is written inside the input.
    Finally, the text "Test" is expected to be inside the input.

    The same process is repeated for the rest of the fields: the description textarea,
    the category select and the photo input.
*/
test('The AddGroup component is working as expected', async () => {
    const {container, getByText, getByLabelText} = render(<AddGroup/>)
    const textfieldGroupName = getByLabelText("Group name")
    const createButton = getByText('Create')
    const options: NodeListOf<Element> = container.querySelectorAll('input[type = "checkbox"]')
    fireEvent.change(textfieldGroupName, {target: {value: 'TestGroup'}})
    fireEvent.click(options.item(0));
    fireEvent.click(createButton)
    expect(getByText("Done!")).toBeInTheDocument();

});

afterAll(() => {
    jest.restoreAllMocks();
});