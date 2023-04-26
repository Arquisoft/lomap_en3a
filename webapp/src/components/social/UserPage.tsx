import React from "react";
import User from "../../domain/User";
import TablePagination from '@mui/material/TablePagination';
import {Avatar, Paper, TableBody, TableCell, TableRow} from "@mui/material";
import Place from "../../domain/Place";
import Map from "../../domain/Map";
import PaginatedTable from "../basic/PaginatedTable";
import "../../styles/userProfile.css";
import Social from "../../pages/Social";

interface UserPageProps {
    user: User
}

interface UserPageState {
    placePage: number
    mapPage: number
    placeShown: Place | null
    pageToChange: JSX.Element | null
}

/**
 * This class is set to present the page of a given user in the props
 * @param {User} user - The user to be presented in the page
 * @author UO283069
 */
export default class UserPage extends React.Component<UserPageProps, UserPageState> {

    private placesArray: Array<Place>;
    private mapsArray: Array<Map>;
    private places: JSX.Element;
    private maps: JSX.Element;


    constructor(props: UserPageProps) {
        super(props);
        this.placesArray = new Array<Place>();
        this.mapsArray = new Array<Map>();
        this.mapsArray.push(new Map("Test", "Test", "Test"));
        this.placesArray.push(new Place("test", 1, 1, "test", [], "test", "catTest"));
        this.state = {
            placePage: 0,
            mapPage: 0,
            placeShown: null,
            pageToChange: null
        }

        this.places = <></>;
        this.maps = <></>;

        // Get the maps from the user, update the pages of the tables
        this.getMaps().then(() => {
            this.setState(() => ({
                placePage: 0,
                mapPage: 0
            }));
            this.maps = (<TableBody>
                {this.mapsArray.map((map) => (
                    <TableRow key={map.getName()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                        < TableCell component="th" scope="row">{map.getName()}</TableCell>
                        <TableCell align="right"><a>See map</a></TableCell>
                    </TableRow>
                ))}
            </TableBody>);
        });

        this.places = (<TableBody>
            {this.placesArray.map((place) => (
                <TableRow key={place.title} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    < TableCell component="th" scope="row">{place.title}</TableCell>
                    <TableCell align="right">{place.latitude},{place.longitude}</TableCell>
                    <TableCell align="right">{place.description}</TableCell>
                    <TableCell align="right">Info</TableCell>
                </TableRow>
            ))}
        </TableBody>);
    }

    private async getMaps() {
        //this.mapsArray = await new PODManager().getAllMaps(this.props.user.getWebId());
    }

    /**
     * Handles the change of page on the table of places, when a given page changes this method
     * is in charge of updating the page number.
     * Other attributes of the state are left unchanged as they will only be updated once
     * in order to change the represented element.
     * @param {React.MouseEvent<HTMLButtonElement> | null} event - The React mouse event
     * @param {number} page - The page in which we are
     */
    private onPlacePageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState((previousState) => ({
            placePage: page,
            mapPage: previousState.mapPage,
            placeShown: null,
            pageToChange: null
        }));
    }

    /**
     * Handles the change of page on the table of maps, when a given page changes this method
     * is in charge of updating the page number.
     * Other attributes of the state are left unchanged as they will only be updated once
     * in order to change the represented element.
     * @param {React.MouseEvent<HTMLButtonElement> | null} event - The React mouse event
     * @param {number} page - The page in which we are
     */
    private onMapPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState((previousState) => ({
            placePage: previousState.placePage,
            mapPage: page,
            placeShown: null,
            pageToChange: null
        }));
    }

    render() {
        if (this.state?.pageToChange != null) {
            return this.state.pageToChange;
        }
        return (
            <>
                <div className="back-page-link-container">
                    <a className="back-page-link" onClick={() => {
                        this.setState({
                            placePage: 0,
                            mapPage: 0,
                            placeShown: null,
                            pageToChange: (<Social/>)
                        })
                    }}>Friends list</a>
                </div>
                <main className="user-profile">
                    <h1>{this.props.user.getName()}</h1>
                    <Avatar alt="User avatar"
                            sx={{
                                backgroundColor: "#B2CCEB",
                                width: 200,
                                height: 200,
                                fontSize: 100
                            }}>{this.props.user.getName()?.charAt(0)}</Avatar>
                    <a href={this.props.user.getWebId()}>SOLID Profile</a>
                    <div className="friends-tables">
                        <label htmlFor="places-table">Friends places</label>
                        <Paper id="places-table" sx={{margin: "0.5em"}}>
                            <PaginatedTable tableName="places" tableBody={this.places}
                                            headCells={["Title", "Coordinates", "Description", "Information"]}
                                            headerCellStyle={{color: "white"}} page={this.state.placePage}
                                            pageHandler={this.onPlacePageChange}></PaginatedTable>
                        </Paper>
                        <label htmlFor="maps-table">Friends maps</label>
                        <Paper id="maps-table" sx={{margin: "0.5em"}}>
                            <PaginatedTable tableName="places" tableBody={this.maps}
                                            headCells={["Name", "Description", "Link"]}
                                            headerCellStyle={{color: "white"}} page={this.state.mapPage}
                                            pageHandler={this.onMapPageChange}></PaginatedTable>

                        </Paper>
                    </div>
                </main>
            </>);
    }
}