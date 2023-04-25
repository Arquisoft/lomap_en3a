import React from "react";
import User from "../domain/User";
import Map from "../domain/Map";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import PODManager from "../adapters/solid/PODManager";
import FriendManager from "../adapters/solid/FriendManager";
import PaginatedTable from "../components/basic/PaginatedTable";
import {TableBody} from "@mui/material";
import LoadingPage from "../components/basic/LoadingPage";

interface UserStuffState {
    maps: Map[]
    user: string
    page: number
}

export default class UserStuff extends React.Component<any, any> {

    private user: User | null;
    private tableMaps: JSX.Element | null;

    constructor(props: any) {
        super(props);
        this.user = null;
        this.tableMaps = null;
        this.state = {
            maps: [],
            user: SolidSessionManager.getManager().getWebID(),
            page: 0
        }
        // Update the state with the loadUserData method:
        // gets the maps from the user, then we must use another async
        // method to load the user from the session, as only yhe webID is stored
        // TODO change the content of this .then to a nother async method, in this way
        // TODO we can load the user loadUserData().then(this.{nameMethod}.then(...))...
        this.loadUserData().then(async r => {
            this.user = await new FriendManager().getUserData(this.props.user);
            this.tableMaps = <TableBody></TableBody>
        });

    }

    private async loadUserData() {
        this.setState(async (prevState: UserStuffState) => ({
            maps: await new PODManager().getAllMaps(),
            user: prevState.user,
            page: 0
        }));
    }

    /**
     * Aimed to only changing the page of the paginated table of the users maps
     * @param event
     * @param page
     * @private
     */
    private onMapPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState((prevState: UserStuffState) => ({
            maps: prevState.maps,
            user: prevState.user,
            page: page
        }))
    }

    render() {
        // Just to show the loading page instead of the content while fetching
        // Remember to update the state as the user is updated in order to display the actual content
        if (this.user == null) {
            return <LoadingPage/>;
        }
        return (<main>
            <h2>{this.user?.getName()}</h2>
            <PaginatedTable tableName={"user-maps"} headCells={[""]} tableBody={this.tableMaps || <TableBody/>}
                            page={this.state.page}
                            pageHandler={this.onMapPageChange}/>
        </main>);
    }

}