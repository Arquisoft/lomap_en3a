import React from 'react';
import {render, waitFor} from '@testing-library/react';
import LeafletMapAdapter from "./LeafletMapAdapter";
import PODManager from "../solid/PODManager";

const crypto = require('crypto');

Object.defineProperty(globalThis, 'crypto', {
    value: {
        randomUUID: () => crypto.randomUUID()
    }
});

beforeAll(() => {

    // We  mock the implementation of the map saving functionality
    jest.spyOn(PODManager.prototype, "saveMap").mockImplementation(async (map) => {

        }
    )
});

test('The map renders correctly with no props given', async () => {

    render(<LeafletMapAdapter/>)
    expect(document.querySelector(".MapContainer") != null);

});
