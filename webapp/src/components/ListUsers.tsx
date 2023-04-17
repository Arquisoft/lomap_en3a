import React from "react";
import FriendManager from "../adapters/solid/FriendManager";
import User from "../domain/User";


interface UserListProps {
    fm: FriendManager;
}

interface UserListState {
    loadedFriends: boolean
}

export default class ListUsers extends React.Component<UserListProps, UserListState> {

    private users: Array<User>;
    private listUsers: JSX.Element = <h3>Loading...</h3>;

    public constructor(props: UserListProps) {
        super(props);
        this.users = new Array<User>; // Empty list

        this.setState(() => ({
            loadedFriends: false
        }));

        // We assign to users the actual list of users
        this.getUsers().then(() => {
            if (this.users.length == 0) {
                this.setState(() => ({
                    loadedFriends: false
                }));
                this.listUsers = <li>No friends yet</li>;
            }else{
                this.setState(() => ({
                    loadedFriends: true
                }));
            }
        }).catch(error => {
            this.listUsers = <li>There was an error uploading the friends: {error.message}</li>;
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
                {this.state?.loadedFriends ? this.users.map((user) =>
                    <li>{user.getName()}</li>
                ) : this.listUsers || this.listUsers}
            </ul>
        );
    }

}