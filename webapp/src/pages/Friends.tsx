import React from "react";
import ListUsers from "../components/friends/ListUsers";
import FriendManager from "../adapters/solid/FriendManager";
import "../styles/friendsPage.css";

interface FriendsState {
    componentToPresent: JSX.Element | null
}

export default class Friends extends React.Component<any, FriendsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            componentToPresent: null
        }
    }

    private changeComponentToPresent(component: JSX.Element) {
        this.setState({
            componentToPresent: component
        });
    }

    public render() {

        if (this.state.componentToPresent != null) {
            return this.state.componentToPresent;
        }

        return (
            <section style={{height: "max-content"}}>
                <h2>My friends</h2>
                <div>
                    <ListUsers fm={new FriendManager()} callback={this.changeComponentToPresent.bind(this)}></ListUsers>
                </div>
            </section>
        );
    }

}