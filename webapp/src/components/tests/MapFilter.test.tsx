import React from 'react';
import {render} from '@testing-library/react';
import MapFilter from '../MapFilter';

test('When the MapFilter renders, all the categories are shown', () => {
    const categories: string[] = ["Restaurant", "Monument", "Museum", "Education"];
    const {getByText} = render(<MapFilter categories={categories}></MapFilter>);
    for (const i in categories) {
        expect(getByText(categories[i])).toBeInTheDocument();
    }
});

