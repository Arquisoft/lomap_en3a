import React from 'react';
import {render} from '@testing-library/react';
import UserPlaceHolder from "../social/UserPlaceHolder";
import User from "../../domain/User";


test('The user is rendered properly', () => {
    const user = new User("Dummy", "dummy.inrupt.net");
    const {getByText} = render(<UserPlaceHolder user={user} callback={() => {
    }}/>);
    expect(getByText("Dummy")).toBeInTheDocument();
});