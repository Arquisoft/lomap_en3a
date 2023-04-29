import React from 'react';
import {render} from '@testing-library/react';
import ImageList from "../../../components/basic/ImageList";

test('The image list renders properly all of the passed images', () => {
    const images = ["https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074__340.jpg"]
    const {getByLabelText} = render(<ImageList images={images}></ImageList>)
    expect(getByLabelText("Next Slide")).toBeInTheDocument();
    expect(getByLabelText("Previous Slide")).toBeInTheDocument();
});