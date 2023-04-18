import React from "react";
import User from "../../domain/User";
import TablePagination from '@mui/material/TablePagination';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

interface UserPageProps {
    user: User
}

interface UserPageState {
    page: number
}

export default class UserPage extends React.Component<UserPageProps, UserPageState> {

    private testRows: Array<string>;

    constructor(props: UserPageProps) {
        super(props);
        this.testRows = new Array();
        this.testRows.push("Test");
        this.testRows.push("Test");
        this.state = {
            page: 0
        }
    }

    private onPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState({
            page: page
        });
    }

    render() {
        return (<main>
            <h1>{this.props.user.getName()}</h1>
            <Paper>
                <TableContainer>
                    <Table sx={{minWidth: 650}} aria-label="places">
                        <TableHead>
                            <TableCell>Place Name</TableCell>
                            <TableCell align="right">Coordinates</TableCell>
                        </TableHead>
                    </Table>
                </TableContainer>
                <TableBody>
                    {this.testRows.map((test) => (
                        <TableRow key={test} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                            < TableCell component="th" scope="row">Name test</TableCell>
                            <TableCell align="right">Coordinates test</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TablePagination rowsPerPageOptions={[5, 10, 25]} count={-1} onPageChange={this.onPageChange}
                                 page={this.state.page}
                                 rowsPerPage={5}/>
            </Paper>
        </main>);
    }
}