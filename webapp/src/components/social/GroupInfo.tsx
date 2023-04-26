import React from "react";
import PaginatedTable from "../basic/PaginatedTable";
import {TableBody} from "@mui/material";

export default class GroupInfo extends React.Component<any, { page: number }> {

    private tableBody = (<TableBody>
        {}
    </TableBody>)

    constructor(props: any) {
        super(props);
        this.state = {
            page: 0
        }
    }

    /**
     * Aimed to manage the page change on the paginated table of the maps
     * @param event
     * @param {number} page
     * @private
     */
    private onMapPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState((prevState) => ({
            page: page
        }));
    }

    render() {
        return (
            <section>
                <h2>Group title</h2>
                <p>Group description</p>
                <PaginatedTable tableName={"group-maps"} headCells={["Title", "Description", "Link"]}
                                tableBody={this.tableBody} page={this.state.page} pageHandler={this.onMapPageChange}/>
            </section>
        );
    }

}
