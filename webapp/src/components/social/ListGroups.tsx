import React from "react";
import User from "../../domain/User";
import PaginatedTable from "../basic/PaginatedTable";
import {TableBody} from "@mui/material";
import LoadingPage from "../basic/LoadingPage";

interface ListGroupsProps {
    user: User
}

export default class ListGroups extends React.Component<ListGroupsProps, { page: number, loaded: boolean }> {

    private tableBody = (<TableBody>
        {}
    </TableBody>)

    constructor(props: ListGroupsProps) {
        super(props);
        this.state = {
            page: 0,
            loaded: false
        }

        //TODO load the user's groups, as the user is passed as a parameter it should only require one async method


    }

    /**
     * Aimed to manage the page change on the paginated table of the groups
     * @param event
     * @param page
     * @private
     */
    private onGroupPageChange(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
        this.setState((prevState) => ({
            page: page,
            loaded: prevState.loaded
        }));
    }

    render() {
        // Display while the data is fetched, remember to change the state to {loaded:true} so that
        // content is displayed instead of the LoadingPage
        if (!this.state.loaded) {
            return <LoadingPage size={100} style={{position:"relative"}}/>;
        }
        return <>
            <PaginatedTable tableName={"user-groups"} headCells={["Group name", "Link"]} tableBody={this.tableBody}
                            page={this.state.page} pageHandler={this.onGroupPageChange}/>
        </>;
    }


}