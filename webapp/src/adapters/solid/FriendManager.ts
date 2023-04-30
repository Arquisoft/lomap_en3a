import SolidSessionManager from "./SolidSessionManager";
import {
    getSolidDataset, getStringNoLocale, getThing,
    getUrlAll, Thing
} from "@inrupt/solid-client";
import User from "../../domain/User";
import {FOAF, VCARD} from "@inrupt/vocab-common-rdf";

/**
 * This class is for all actions related with management of friends of each user. Like
 * retrieving the POD a list of friends, adding a friend, deleting a friend, etc
 * */
export default class FriendManager {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    /**
     * Ir searches all the friends related with the person logged in stored in the card from its POD
     *
     * @return A list of User objects representing friends
     * */
    public async getFriendsList(): Promise<Array<User>> {
        //URL with #me at the end
        const webId = this.sessionManager.getWebID();
        const webIdDoc = await getSolidDataset(webId, {fetch: this.sessionManager.getSessionFetch()});
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
        let webIdDoc = await getSolidDataset(webID, {fetch: this.sessionManager.getSessionFetch()});
        let friends = getThing(webIdDoc, webID);
        //It returns all the values in the knows property of the object Thing
        let name = getStringNoLocale(<Thing>friends, VCARD.fn);
        let photo = webID + "profile/" + getStringNoLocale(<Thing>friends, VCARD.hasPhoto);
        let note = getStringNoLocale(<Thing>friends, VCARD.note);
        let role = getStringNoLocale(<Thing>friends, VCARD.role);
        let organization = getStringNoLocale(<Thing>friends, VCARD.organization_name);

        let user = new User(name, webID);
        user.photo = photo;
        user.note = note;
        user.role = role;
        user.organization = organization;

        return new User(name, webID);
    }
}