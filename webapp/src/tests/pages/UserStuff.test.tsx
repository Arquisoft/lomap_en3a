import React from 'react';
import {render, waitFor} from "@testing-library/react";
import PODManager from "../../adapters/solid/PODManager";
import Map from "../../domain/Map";
import UserStuff from "../../pages/UserStuff";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";

// To prevent crypto error
const crypto = require('crypto');

Object.defineProperty(globalThis, 'crypto', {
    value: {
        randomUUID: () => crypto.randomUUID()
    }
});

test('The page renders properly with no maps', async () => {

    let maps: Map[] = [];
    jest.spyOn(PODManager.prototype, "getAllMaps").mockImplementation(async () => {
        return maps;
    })
    jest.spyOn(FriendManager.prototype, "getUserData").mockImplementation(async (webID) => {
        return new User("Test user", "test");
    });
    jest.spyOn(SolidSessionManager.prototype, "getWebID").mockImplementation(() => {
        return "test";
    });

    const {getByText} = render(<UserStuff/>);
    await waitFor(() => {
        expect(getByText("Test user")).toBeInTheDocument();
        expect(getByText("Map link")).toBeInTheDocument();
    })

});
