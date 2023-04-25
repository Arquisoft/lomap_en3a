import React from "react";
import {SxProps, Table, TableCell, TableContainer, TableHead, Theme} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";

interface PaginatedTableProps {
    tableName: string
    headCells: string[]
    tableBody: JSX.Element
    headerCellStyle?: SxProps<Theme> | undefined
    page: number
    pageHandler: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void
    rowsPerPageOptions?: number[]
    count?: number
    rowsPerPage?: number
}

/**
 * This class returns an already paginated table using React @mui/material classes.
 * Parameters:
 *     @param {string} tableName
 *     @param {string[]} headCells
 *     @param {JSX.Element} tableBody
 *     @param {SxProps<Theme> | undefined} [headerCellStyle]
 *     @param {number} page
 *     @param {(event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void} pageHandler
 *     @param {number[]} [rowsPerPageOptions=[5,10,25]]
 *     @param {number} [count=-1]
 *     @param {number} [rowsPerPage=5]
 */
export default class PaginatedTable extends React.Component<PaginatedTableProps, any> {

    constructor(props: PaginatedTableProps) {
        super(props);
    }


    render() {
        return (<>
                <TableContainer>
                    <Table className="paginated-table" aria-label={this.props.tableName}>
                        <TableHead className="table-header">
                            {this.props.headCells.map((head, index) => (
                                <TableCell sx={this.props.headerCellStyle || {color: "white"}}
                                           align={index != 0 ? "right" : "left"}>{head}</TableCell>
                            ))}
                        </TableHead>
                        {this.props.tableBody}
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={this.props.rowsPerPageOptions != null ? this.props.rowsPerPageOptions : [5, 10, 25]}
                    count={this.props.count != null ? this.props.count : -1}
                    onPageChange={this.props.pageHandler}
                    page={this.props.page}
                    rowsPerPage={this.props.rowsPerPage != null ? this.props.rowsPerPage : 5}/>
            </>
        );
    }

}