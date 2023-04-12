import React from 'react';
import {render} from '@testing-library/react';
import MapFilter from '../MapFilter';
import {PlaceCategory} from '../../domain/Place/PlaceCategory';

test('When the MapFilter renders, all the categories are shown', () => {
    const categories: string[] = Object.keys(PlaceCategory);
    const {getByText} = render(<MapFilter callback={()=>{}}/>);
    for (const i in categories) {
        expect(getByText(categories[i])).toBeInTheDocument();
    }
});

