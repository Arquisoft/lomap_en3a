import SolidSessionManager from "./SolidSessionManager";
import User from "../../domain/User";

export default class FriendManager {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    /**
     * It returns all the friends related with the person signed in
     * */
    public getFriendsList(): Array<User> {
        var friends = new Array();
        return friends;
    }

    public addFriend(user: User): boolean {
        return false;
    }

    public removeFriend(user: User): boolean{

    }
}