import React from "react";
import ReactTable from "../basic/ReactTable";
import {TableBody} from "@mui/material";
import Button from "@mui/material/Button";

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

    private exitGroup() {
        // TODO
    }

    render() {
        return (
            <section>
                <h2>Group title</h2>
                <p>Group description</p>
                <Button variant="contained" color={"error"} onClick={this.exitGroup}></Button>
                <ReactTable tableName={"group-maps"} headCells={["Title", "Description", "Link"]}
                            tableBody={this.tableBody}/>
            </section>
        );
    }

}
