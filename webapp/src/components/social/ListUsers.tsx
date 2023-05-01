import React from "react";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import UserPlaceHolder from "./UserPlaceHolder";
import LoadingPage from "../basic/LoadingPage";
import EmptyList from "../basic/EmptyList";


interface UserListProps {
    fm: FriendManager;
    callback: (component: JSX.Element) => void;
}

interface UserListState {
    loadedFriends: boolean
}

export default class ListUsers extends React.Component<UserListProps, UserListState> {

    private users: Array<User>;
    private listUsers: JSX.Element = <LoadingPage size={100} style={{position: "absolute", left: "45%"}}/>;

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
                this.listUsers =
                    <EmptyList firstHeader={"Your friend list is empty!"} image={"/map-magnifier.png"}
                               secondHeader={<>Add some friends through your <a
                                          href={"inrupt.net"}>inrupt.net</a> account</>}/>;
            } else {
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
        return (<div className="friendsGrid">
                {this.state?.loadedFriends ? this.users.map((user) =>
                    <UserPlaceHolder user={user} callback={this.props.callback}></UserPlaceHolder>
                ) : this.listUsers || this.listUsers}
            </div>
        );
    }

}