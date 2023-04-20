//import SolidSessionManager from "./SolidSessionManager";
import {getWebID} from "./SolidSessionManager";
import {
    getSolidDataset, getStringNoLocale, getThing,
    getUrlAll, Thing
} from "@inrupt/solid-client";
import User from "../../domain/User";
import {FOAF} from "@inrupt/vocab-common-rdf";

/**
 * This class is for all actions related with management of friends of each user. Like
 * retrieving the POD a list of friends, adding a friend, deleting a friend, etc
 * */
export default class FriendManager {

    //private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    /**
     * Ir searches all the friends related with the person logged in stored in the card from its POD
     *
     * @return A list of User objects representing friends
     * */
    public async getFriendsList(): Promise<Array<User>> {
        //URL with #me at the end
        const webId = getWebID();
        const webIdDoc = await getSolidDataset(webId);
        const friends = getThing(webIdDoc, webId);
        //It returns all the values in the knows property of the object Thing
        const friendWebIds = getUrlAll(<Thing>friends, FOAF.knows);
        let friendsList = new Array<User>()
        for (let a of friendWebIds) {
            friendsList.push(await this.getUserData(a));
        }
        return friendsList;
    }

    /**
     * From a webID it returns all the information from a person in a User object
     *
     * @param webID A string identifying the pod of a user
     *
     * @return The object User corresponding to the POD of the webID
     * */
    public async getUserData(webID: string): Promise<User> {
        let webId = webID + "profile/card";
        let webIdDoc = await getSolidDataset(webId);
        let friends = getThing(webIdDoc, webId + "#me");
        //It returns all the values in the knows property of the object Thing
        let name = getStringNoLocale(<Thing>friends, FOAF.name);
        return new User(name, webID);
    }

    // public addFriend(user: User): boolean {
    //     return false;
    // }

    // public removeFriend(user: User): boolean{
    //
    // }
}