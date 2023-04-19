import React from "react";
import User from "../../domain/User";
import TablePagination from '@mui/material/TablePagination';
import {Avatar, Paper, TableBody, TableCell, TableRow} from "@mui/material";
import Place from "../../domain/Place";
import Map from "../../domain/Map";
import PaginatedTable from "../basic/PaginatedTable";
import "../../styles/userProfile.css";
import Friends from "../../pages/Friends";

interface UserPageProps {
    user: User
}

interface UserPageState {
    page: number
    placeShown: Place | null
    pageToChange: JSX.Element | null
}

export default class UserPage extends React.Component<UserPageProps, UserPageState> {

    private testPlaces: Array<Place>;
    private testMaps: Array<Map>;
    private readonly places: JSX.Element;
    private readonly maps: JSX.Element;


    constructor(props: UserPageProps) {
        super(props);
        this.testPlaces = new Array<Place>();
        this.testMaps = new Array<Map>();
        this.testMaps.push(new Map("Test", "Test", "Test"));
        this.testPlaces.push(new Place("test", 1, 1, "test", [], "test", "catTest"));
        this.state = {
            page: 0,
            placeShown: null,
            pageToChange: null
        }
        this.places = (<TableBody>
            {this.testPlaces.map((place) => (
                <TableRow key={place.title} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    < TableCell component="th" scope="row">{place.title}</TableCell>
                    <TableCell align="right">{place.latitude},{place.longitude}</TableCell>
                    <TableCell align="right">{place.description}</TableCell>
                    <TableCell align="right">Info</TableCell>
                </TableRow>
            ))}
        </TableBody>);

        this.maps = (<TableBody>
            {this.testMaps.map((map) => (
                <TableRow key={map.getName()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    < TableCell component="th" scope="row">{map.getName()}</TableCell>
                    <TableCell align="right">{map.getDescription()}</TableCell>
                    <TableCell align="right">See map</TableCell>
                </TableRow>
            ))}
        </TableBody>);
    }

    private onPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState({
            page: page,
            placeShown: null,
            pageToChange: null
        });
    }

    render() {
        if (this.state?.pageToChange != null) {
            return this.state.pageToChange;
        }
        return (
            <>
                <a className="back-page-link" onClick={() => {
                    this.setState({
                        page: 0,
                        placeShown: null,
                        pageToChange: (<Friends/>)
                    })
                }}>⮫Friends list</a>
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
                                            headerCellStyle={{color: "white"}}></PaginatedTable>
                            <TablePagination rowsPerPageOptions={[5, 10, 25]} count={-1}
                                             onPageChange={this.onPageChange}
                                             page={this.state.page}
                                             rowsPerPage={5}/>
                        </Paper>
                        <label htmlFor="maps-table">Friends maps</label>
                        <Paper id="maps-table" sx={{margin: "0.5em"}}>
                            <PaginatedTable tableName="places" tableBody={this.maps}
                                            headCells={["Name", "Description", "Link"]}
                                            headerCellStyle={{color: "white"}}></PaginatedTable>
                            <TablePagination rowsPerPageOptions={[5, 10, 25]} count={-1}
                                             onPageChange={this.onPageChange}
                                             page={this.state.page}
                                             rowsPerPage={5}/>

                        </Paper>
                    </div>
                </main>
            </>);
    }
}