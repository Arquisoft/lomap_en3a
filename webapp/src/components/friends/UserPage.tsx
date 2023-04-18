import React, {MouseEventHandler} from "react";
import User from "../../domain/User";
import TablePagination from '@mui/material/TablePagination';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Place from "../../domain/Place";
import Map from "../../domain/Map";

interface UserPageProps {
    user: User
}

interface UserPageState {
    page: number
    placeShown: Place | null
}

export default class UserPage extends React.Component<UserPageProps, UserPageState> {

    private testPlaces: Array<Place>;
    private testMaps: Array<Map>;

    constructor(props: UserPageProps) {
        super(props);
        this.testPlaces = new Array<Place>();
        this.testMaps = new Array<Map>();
        this.testMaps.push(new Map("Test", "Test", "Test"));
        this.testPlaces.push(new Place("test", 1, 1, "test", [], "test", "catTest"));
        this.state = {
            page: 0,
            placeShown: null
        }
    }

    private onPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState({
            page: page,
            placeShown: null
        });
    }

    render() {
        return (<main>
            <h1>{this.props.user.getName()}</h1>
            <label htmlFor="places-table">Friends places</label>
            <Paper id="places-table" sx={{margin: "0.5em"}}>
                <TableContainer>
                    <Table sx={{minWidth: 650}} aria-label="places">
                        <TableHead>
                            <TableCell>Place Name</TableCell>
                            <TableCell align="right">Coordinates</TableCell>
                            <TableCell align="right">Coordinates</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Information</TableCell>
                        </TableHead>
                        <TableBody>
                            {this.testPlaces.map((place) => (
                                <TableRow key={place.title} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                                    < TableCell component="th" scope="row">{place.title}</TableCell>
                                    <TableCell align="right">{place.latitude},{place.longitude}</TableCell>
                                    <TableCell align="right">{place.description}</TableCell>
                                    <TableCell align="right">Info</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[5, 10, 25]} count={-1} onPageChange={this.onPageChange}
                                 page={this.state.page}
                                 rowsPerPage={5}/>

            </Paper>
            <label htmlFor="maps-table">Friends maps</label>

        </main>);
    }
}