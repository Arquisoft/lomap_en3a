import React from "react";
import User from "../domain/User";
import Map from "../domain/Map";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import PODManager from "../adapters/solid/PODManager";
import FriendManager from "../adapters/solid/FriendManager";
import PaginatedTable from "../components/basic/PaginatedTable";
import {TableBody, TableCell, TableRow} from "@mui/material";
import LoadingPage from "../components/basic/LoadingPage";
import MapInfo from "./MapInfo";

interface UserStuffState {
    maps: Map[]
    user: string
    page: number
    componentToDisplay: JSX.Element
}

export default class UserStuff extends React.Component<any, any> {

    private user: User | null;
    private tableMaps: JSX.Element;

    constructor(props: any) {
        super(props);
        this.user = null;
        this.tableMaps = <></>;
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
        this.loadUserData().then(r => {
            this.tableMaps = (<TableBody>
                {this.state.maps.map((map: Map) => (
                    <TableRow key={map.getName()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                        < TableCell component="th" scope="row">{map.getName()}</TableCell>
                        <TableCell align="right">{map.getDescription()}</TableCell>
                        <TableCell align="right"><a onClick={() => {
                            this.displayMap(map)
                        }}>See map</a></TableCell>
                    </TableRow>
                ))}
            </TableBody>);
            this.setState(() => ({
                page: 0
            }));
        });

    }

    private displayMap(map: Map) {
        this.setState(() => ({
            componentToDisplay: <MapInfo map={map}/>
        }));
    }

    private async loadUserData() {
        const mapsAux = await new PODManager().getAllMaps();
        console.log(mapsAux[1])
        this.setState(() => ({
            maps: mapsAux
        }));
        // TODO FIX
        // console.log(SolidSessionManager.getManager().getWebID());
        this.user = await new FriendManager().getUserData("https://uo283069.inrupt.net/");
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

        if (this.state.componentToDisplay != null) {
            return this.state.componentToDisplay;
        }

        return (<main>
            <h2>{this.user?.getName()}</h2>
            <PaginatedTable tableName={"user-maps"} headCells={["Map name", "Map link"]}
                            headerCellStyle={{color: "white"}} tableBody={this.tableMaps}
                            page={this.state.page}
                            pageHandler={this.onMapPageChange}/>
        </main>);
    }

}