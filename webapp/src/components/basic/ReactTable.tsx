import React from "react";
import {Paper, SxProps, Table, TableCell, TableContainer, TableHead, Theme} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import "../../styles/paginatedTablesContentStyle.css";

interface PaginatedTableProps {
    tableName: string
    headCells: string[]
    tableBody: JSX.Element
    headerCellStyle?: SxProps<Theme> | undefined
    id?: string
}

/**
 * This class returns a table using Reacts @mui/material classes.
 *
 *     @param {string} tableName
 *     @param {string[]} headCells
 *     @param {JSX.Element} tableBody
 *     @param {SxProps<Theme> | undefined} [headerCellStyle]
 *     @param {string} [id="react-table"]
 *     @see There is a separate css file describing the style for this component, see styles/paginatedTablesContentStyle.css
 */
export default class ReactTable extends React.Component<PaginatedTableProps, any> {

    constructor(props: PaginatedTableProps) {
        super(props);
    }


    render() {
        return (<Paper id={this.props.id || "paginated-table"} sx={{margin: "0.5em"}}>
                <TableContainer>
                    <Table className="paginated-table" aria-label={this.props.tableName} sx={{minWidth: "650px"}}>
                        <TableHead className="table-header">
                            {this.props.headCells.map((head, index) => (
                                <TableCell sx={this.props.headerCellStyle || {color: "white"}}
                                           align={index != 0 ? "right" : "left"}>{head}</TableCell>
                            ))}
                        </TableHead>
                        {this.props.tableBody}
                    </Table>
                </TableContainer>
            </Paper>
        );
    }

}