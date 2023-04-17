import React from "react";
import ListUsers from "../components/friends/ListUsers";
import FriendManager from "../adapters/solid/FriendManager";
import "../styles/friendsPage.css";

export default class Friends extends React.Component {

    private searchFriend: string = "";

    private addFriend(name: string) {
        var fm = new FriendManager();
        // return gm.addFriend(name);
    }

    public render() {
        return (
            <section style={{height: "max-content"}}>
                <h2>My friends</h2>
                <div>
                    <ListUsers fm={new FriendManager()}></ListUsers>
                </div>
            </section>
        );
    }

}