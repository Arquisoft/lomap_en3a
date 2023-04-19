import React from "react";
import {Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";

interface PaginatedTableProps {
    tableName: string
    headCells: string[]
    tableBody: JSX.Element
    headerCellStyle? : SxProps<Theme> | undefined
}

export default class PaginatedTable extends React.Component<PaginatedTableProps, any> {

    constructor(props: PaginatedTableProps) {
        super(props);
    }


    render() {
        return (
            <TableContainer>
                <Table className="paginated-table" aria-label={this.props.tableName}>
                    <TableHead className="table-header">
                        {this.props.headCells.map((head, index) => (
                            <TableCell sx={this.props.headerCellStyle}
                                       align={index != 0 ? "right" : "left"}>{head}</TableCell>
                        ))}
                    </TableHead>
                    {this.props.tableBody}
                </Table>
            </TableContainer>
        );
    }

}