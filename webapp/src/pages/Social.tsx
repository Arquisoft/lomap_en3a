import React from "react";
import ListUsers from "../components/social/ListUsers";
import FriendManager from "../adapters/solid/FriendManager";
import "../styles/friendsPage.css";
import ListGroups from "../components/social/ListGroups";

interface FriendsState {
    componentToPresent: JSX.Element | null
}

export default class Social extends React.Component<any, FriendsState> {

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
            <section style={{height: "max-content", margin: "1em"}}>
                <h2>My Friends</h2>
                <div>
                    <ListUsers fm={new FriendManager()} callback={this.changeComponentToPresent.bind(this)}></ListUsers>
                </div>
                <h2>My Groups</h2>
                <ListGroups user={this.props.user}/>
            </section>
        );
    }

}