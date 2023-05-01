import React from 'react';
import {fireEvent, getByPlaceholderText, render, waitFor, screen} from '@testing-library/react';
import Placemark from '../../domain/Placemark';
import SolidSessionManager from '../../adapters/solid/SolidSessionManager';
import FriendManager from '../../adapters/solid/FriendManager';
import User from '../../domain/User';
import AddPlace from '../../components/place/AddPlace';
import userEvent from '@testing-library/user-event';

const latitude = 0.2;
const longitude = 0.9;
const title = "Test";
const category = "Test";


beforeEach(() => {
    // As the session manager uses fetching functions
    jest.spyOn(SolidSessionManager.prototype, "isLoggedIn").mockImplementation(() => {
        return true;
    });
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "https://testID";
    });
    jest.spyOn(FriendManager.prototype, "getFriendsList").mockImplementation(() => {
        let friendsList = new Array<User>();
        const user1 = new User("testFriend1", "https://testFriend1");
        const user2 = new User("testFriend2", "https://testFriend2");
        friendsList.push(user1);
        friendsList.push(user2);
        return Promise.resolve(friendsList);
    });
});

test('The AddPlace component is rendering correctly', async () => {
    const {getByText} = render(<AddPlace open={true} placemark={new Placemark(latitude, longitude)} />)
    await waitFor(() => {
        expect(getByText("Fill the information of the new place.")).toBeInTheDocument();
        expect(getByText("Name:")).toBeInTheDocument();
        expect(getByText("Category:")).toBeInTheDocument();
        expect(getByText("Description:")).toBeInTheDocument();
        expect(getByText("Photo:")).toBeInTheDocument();
        expect(getByText("Submit")).toBeInTheDocument();
    });
});

/*
    JEST test for testing if it can be written inside the fields of the form.
    First, the input of type "text", name "name", placeholder "Name" is selected.
    Then, the text "Test" is written inside the input.
    Finally, the text "Test" is expected to be inside the input.

    The same process is repeated for the rest of the fields: the description textarea,
    the category select and the photo input.
*/
test('The AddPlace component is working as expected', async () => {
    const {getByText} = render(<AddPlace open={true} placemark={new Placemark(latitude, longitude)} />)
    await waitFor(() => {
        const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'Test' } });
        expect(nameInput.value).toBe('Test');

        const descriptionTextarea = screen.getByPlaceholderText('Introduce a description') as HTMLTextAreaElement;
        fireEvent.change(descriptionTextarea, { target: { value: 'Test' } });
        expect(descriptionTextarea.value).toBe('Test');
    })
});

test('User can add images to the place', async () => {

    Object.defineProperty(URL, 'createObjectURL', {
        value: jest.fn(() => 'mock-url'),
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: jest.fn(() => 'mock-url'),
      });

    const { getByPlaceholderText } = render(<AddPlace open={true} placemark={new Placemark(latitude, longitude)} />)
    await waitFor(() => {
        const photoInput = getByPlaceholderText('Choose a photo') as HTMLInputElement;
        fireEvent.change(photoInput, { target: { files: [new File(['test'], 'test.jpg', { type: 'image/jpeg' })] } });
        expect(photoInput.files?.length).toBe(1);
    })
});


/**
 * JEST test for testing if the category of the place can be changed.
 * First, the select tag of name "category".
 */
test('User can change the category of the place', async () => {
    const { getByPlaceholderText } = render(<AddPlace open={true} placemark={new Placemark(latitude, longitude)} />)
    await waitFor(() => {
        const categorySelect = screen.getByTitle('category') as HTMLSelectElement;
        userEvent.selectOptions(categorySelect, ['museum']); // Replace 'some-value' with an actual value from your categories
        fireEvent.change(categorySelect, { target: { value: 'museum' } });
        expect(categorySelect.value).toBe('museum');
    });
});

test('input fields are rendered and can be updated', () => {
    const {getByText} = render(<AddPlace open={true} placemark={new Placemark(latitude, longitude)} />)

    const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;

    const descriptionTextarea = screen.getByPlaceholderText('Introduce a description') as HTMLTextAreaElement;
  
    fireEvent.change(nameInput, { target: { value: 'Test Place' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Desc' } });
  
    expect(nameInput).toHaveValue('Test Place');
    expect(descriptionTextarea).toHaveValue('Test Desc');
});

test('form can be submitted and proper action is executed', async () => {
    const mockOnSubmit = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
        <AddPlace
            open={true}
            placemark={new Placemark(latitude, longitude)}
            callback={mockOnSubmit}
        />
    );

    const nameInput = getByPlaceholderText('Name') as HTMLInputElement;
    const descriptionTextarea = getByPlaceholderText(
        'Introduce a description'
    ) as HTMLTextAreaElement;
    const submitButton = getByRole('button', { name: 'Submit' });

    fireEvent.change(nameInput, { target: { value: 'Test Place' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Desc' } });
    fireEvent.click(submitButton);

    // Wait for the callback to be called once
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1));

    // Get the first argument passed to the mock function during the first call
    const submittedPlacemark = mockOnSubmit.mock.calls[0][0];

    // Perform custom assertions on specific fields
    expect(submittedPlacemark.title).toBe('Test Place');
    expect(submittedPlacemark.category).toBe('restaurant');
});