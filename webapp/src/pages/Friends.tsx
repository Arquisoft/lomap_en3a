import React from "react";
import ListUsers from "../components/ListUsers";
import FriendManager from "../adapters/solid/FriendManager";

export default class Friends extends React.Component {

    private searchFriend: string = "";

    private addFriend(name: string) {
        var fm = new FriendManager();
        // return gm.addFriend(name);
    }

    public render() {
        return (
            <section>
                <h2>My friends</h2>
                <div>
                    <ListUsers fm={new FriendManager()}></ListUsers>
                </div>
                <h2>Add friends</h2>
                <form>
                    <input onChange={event => this.searchFriend = (event.target.value)}></input>
                    <button onClick={() => this.addFriend(this.searchFriend)}>Add friend</button>
                </form>
            </section>
        );
    }

}