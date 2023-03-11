import React from "react";
import FriendManager from "../adapters/solid/FriendManager";
import User from "../domain/User";


interface UserListProps {
    fm: FriendManager;
}

interface UserListState {

}


export default class ListUsers extends React.Component<UserListProps, UserListState> {

    private users: Array<User>;
    private listUsers: any = <h3>Loading..</h3>;

    public constructor(props: UserListProps) {
        super(props);
        this.users = new Array<User>; // Empty list
        this.state = {loading: false, title: null};
    }

    async componentDidMount() {
        var users = this.props.fm.getFriendsList();
        // We assign to users the actual list of users
        (async () => {
            this.users = await users;
        })
        this.getUsers(users).then(() => {
            if (this.users.length != 0) {
                this.listUsers = this.users.map((u) => <li>{u.getName()}</li>);
            } else {
                // Map an enty list (Maybe changeable)
                this.listUsers = <li>No friends yet</li>;
            }
            this.forceUpdate();
        }, () => {
            console.log("??");
            this.listUsers = <li>No friends yet</li>;
            this.forceUpdate();
        }).finally(() => {
            console.log("FINALLY");
            this.listUsers = this.users.map((u) => <li>{u.getName()}</li>);
        });
    }

    private async getUsers(users: Promise<Array<User>>) {
        this.users = await users;
    }


    public render() {
        return (<ul>
                {this.listUsers}
            </ul>
        );
    }

}