import React from "react";
import FriendManager from "../adapters/solid/FriendManager";
import User from "../domain/User";


interface UserListProps {
    fm: FriendManager;
}

interface UserListState {

}

export default class ListUsers extends React.Component<UserListProps, UserListState> {

    /** The list of users which are actually the friends from the current user logged in*/
    private users: Array<User>;
    /** The list of friends to show in the UI*/
    private listUsers: any = <h3>Loading..</h3>;

    public constructor(props: UserListProps) {
        super(props);
        this.users = new Array<User>; // Empty list
        // We assign to users the actual list of users
        this.getUsers().then(() => {
            if (this.users.length != 0) {
                this.listUsers = this.users.map((u) => <li>{u.getName()}</li>);
            } else {
                this.listUsers = <li>No friends yet</li>;
            }
            this.forceUpdate();
        }, () => {
            this.listUsers = <li>There was an error uploading the friends</li>;
            this.forceUpdate();
        });
    }

    /**
     * It recovers the friends from the current user logged in
     * */
    private async getUsers() {
        this.users = await this.props.fm.getFriendsList();
    }


    public render() {
        return (<ul>
                {this.listUsers}
            </ul>
        );
    }

}