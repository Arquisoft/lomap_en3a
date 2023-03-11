import SolidSessionManager from "./SolidSessionManager";
import {
    getSolidDataset, getStringNoLocale, getThing,
    getThingAll, getUrl,
    getUrlAll, Thing
} from "@inrupt/solid-client";
import User from "../../domain/User";
import {FOAF, SCHEMA_INRUPT} from "@inrupt/vocab-common-rdf";

export default class FriendManager {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    /**
     * It returns all the friends related with the person signed in
     * */
    public async getFriendsList(): Promise<Array<User>> {
        //URL with #me at the end
        const webId = this.sessionManager.getWebID();
        const webIdDoc = await getSolidDataset(webId);
        console.log(webIdDoc)
        const friends = getThing(webIdDoc, webId);
        //It returns all the values in the knows property of the object Thing
        const friendWebIds = getUrlAll(<Thing>friends, FOAF.knows);
        let friendsList = new Array<User>()
        for(let a of friendWebIds ){
            friendsList.push(await this.getUserData(a));
        }
        // console.log(friendsList)
        return friendsList;
    }

    public async getUserData(webID:string): Promise<User>{
        let webId = webID + "profile/card";
        let webIdDoc = await getSolidDataset(webId);
        console.log(webIdDoc)
        let friends = getThing(webIdDoc, webId + "#me");
        console.log(friends)
        //It returns all the values in the knows property of the object Thing
        let name = getStringNoLocale(<Thing>friends, FOAF.name);
        console.log(name)
        return new User(name, webID);
    }

    // public addFriend(user: User): boolean {
    //     return false;
    // }

    // public removeFriend(user: User): boolean{
    //
    // }
}