import React from "react";
import User from "../domain/User";
import Map from "../domain/Map";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import PODManager from "../adapters/solid/PODManager";
import FriendManager from "../adapters/solid/FriendManager";
import ReactTable from "../components/basic/ReactTable";
import {TableBody, TableCell, TableRow} from "@mui/material";
import LoadingPage from "../components/basic/LoadingPage";
import MapInfo from "./MapInfo";
import Footer from "../components/Footer";
import EmptyList from "../components/basic/EmptyList";

interface UserStuffState {
    maps: Map[]
    user: string
    componentToDisplay: JSX.Element | null,
    loaded: boolean,
    emptyTable: boolean
}

export default class UserStuff extends React.Component<any, UserStuffState> {

    private user: User | null;
    private tableMaps: JSX.Element;

    constructor(props: any) {
        super(props);
        this.user = null;
        this.tableMaps = <></>;
        this.state = {
            maps: [],
            user: SolidSessionManager.getManager().getWebID(),
            componentToDisplay: null,
            loaded: false,
            emptyTable: false
        }
        // Update the state with the loadUserData method:
        // gets the maps from the user, then we must use another async
        // method to load the user from the session, as only yhe webID is stored
        this.loadUserData().then(() => {
            if (this.state.maps.length > 0) {
                this.tableMaps = (<TableBody>
                    {this.state.maps.map((map: Map) => (
                        <TableRow key={map.getName()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                            < TableCell component="th" scope="row">{map.getName()}</TableCell>
                            <TableCell align="right">{map.getDescription() || "No description given"}</TableCell>
                            <TableCell align="right"><a onClick={() => {
                                this.displayMap(map)
                            }}>See map</a></TableCell>
                        </TableRow>
                    ))}
                </TableBody>);

            } else {
                this.setState(({
                    emptyTable: true
                }))
            }
            this.setState(() => ({
                loaded: true
            }));
        }).catch(() => {
            this.setState(() => ({
                loaded: true
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
        if (mapsAux.length === 0) {
            this.setState(({
                loaded: true
            }));
        } else {
            this.setState(() => ({
                maps: mapsAux
            }));
        }
        this.user = await new FriendManager().getUserData(SolidSessionManager.getManager().getWebID());
    }


    render() {
        // Just to show the loading page instead of the content while fetching
        // Remember to update the state as the user is updated in order to display the actual content
        if (!this.state.loaded) {
            return <LoadingPage/>;
        }

        if (this.state.componentToDisplay != null) {
            return this.state.componentToDisplay;
        }


        return (<main style={{margin: "0"}}>
            <div className={"user-info"} style={{marginLeft: "1em"}}>
                <h2 style={{marginBottom: 0}}>{this.user?.getName()}</h2>
                <h3 style={{color: "#2D2D2D", marginTop: 0, marginBottom: 0}}>{this.user?.role}</h3>
                <h4 style={{color: "#505050", marginTop: 0, marginBottom: 0}}>{this.user?.organization}</h4>
                <p style={{marginTop: 0}}>{this.user?.note}</p>
            </div>
            <label htmlFor="maps-table" style={{margin: "1em"}}>Users Maps</label>
            {this.state.emptyTable ?
                <EmptyList firstHeader={"You dont seem to have any map!"} secondHeader={"Try creating a new one"}
                           image={"/map-magnifier.png"}/> :
                <ReactTable tableName={"user-maps"} headCells={["Map name", "Description", "Map link"]}
                            headerCellStyle={{color: "white"}} tableBody={this.tableMaps} id={"maps-table"}/>
            }
            <Footer style={{
                backgroundColor: "#002E66",
                color: "white",
                textAlign: "center",
                fontSize: "x-small",
                height: "6em",
                paddingTop: "0.3em",
                marginTop: "20%"
            }}/>
        </main>)
    }

}