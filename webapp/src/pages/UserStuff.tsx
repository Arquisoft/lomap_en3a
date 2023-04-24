import React from "react";
import User from "../domain/User";
import Map from "../domain/Map";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import PODManager from "../adapters/solid/PODManager";
import FriendManager from "../adapters/solid/FriendManager";
import PaginatedTable from "../components/basic/PaginatedTable";
import {TableBody} from "@mui/material";

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
            user: SolidSessionManager.getManager().getWebID()
        }

        this.loadUserData().then(async r => {
            this.user = await new FriendManager().getUserData(this.props.user);
            this.tableMaps = <TableBody></TableBody>
        });

    }

    private async loadUserData() {
        this.setState(async (prevState: UserStuffState) => ({
            maps: await new PODManager().getAllMaps(),
            user: prevState.user
        }));
    }


    private onMapPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        // TODO
    }

    render() {
        return (<main>
            <PaginatedTable tableName={"user-maps"} headCells={[""]} tableBody={this.tableMaps || <TableBody/>}
                            page={this.state.page}
                            pageHandler={this.onMapPageChange}/>
        </main>);
    }

}