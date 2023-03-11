import React from "react";
import User from "../domain/User";

interface UserListProps {
    users: Promise<Array<User>>;
}

interface UserListState {

}

export default class ListUsers extends React.Component<UserListProps, UserListState> {

    private users: Array<User>;
    private listUsers: any | undefined;

    public constructor(props: UserListProps) {
        super(props);
        this.users = new Array<User>; // Empty list
        var users = props.users;
        // We assign to users the actual list of users
        this.getUsers(users);
        if (this.users != null) {
            this.listUsers = this.users.map((u) => <li>#{u.getName()}
                <button type="submit">Delete friend</button>
            </li>);
        } else {
            // Map an enty list (Maybe changeable)
            this.listUsers = <p>No friends yet</p>;
        }
    }

    private getUsers(users: Promise<Array<User>>) {
        const getResults = async () => {
            this.users = await users;
        }
    }


    public render() {
        return (
            <ul>
                {this.listUsers}
            </ul>
        );
    }

}