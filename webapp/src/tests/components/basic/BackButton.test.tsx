import React from 'react';
import {render} from '@testing-library/react';
import BackButton from "../../../components/basic/BackButton";

test('The back button renders correctly', () => {

    render(<BackButton onClick={() => {
    }}/>)

    const link = document.querySelector("a#back-page-link");

    expect(link != null);

});