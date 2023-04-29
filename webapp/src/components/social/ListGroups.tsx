import React from "react";
import User from "../../domain/User";
import ReactTable from "../basic/ReactTable";
import {TableBody} from "@mui/material";
import LoadingPage from "../basic/LoadingPage";
import Button from "@mui/material/Button";
import AddGroup from "./AddGroup";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";

interface ListGroupsProps {
    user: User
}

export default class ListGroups extends React.Component<ListGroupsProps, {
    page: number,
    loaded: boolean,
    popupOpen: boolean,
}> {

    private tableBody = (<TableBody>
        {}
    </TableBody>)

    constructor(props: ListGroupsProps) {
        super(props);
        this.state = {
            page: 0,
            loaded: true,
            popupOpen: false
        }

        //TODO load the user's groups, as the user is passed as a parameter it should only require one async method


    }

    render() {
        // Display while the data is fetched, remember to change the state to {loaded:true} so that
        // content is displayed instead of the LoadingPage
        if (!this.state.loaded) {
            return <LoadingPage size={100} style={{position: "absolute", left: "45%"}}/>;
        }
        return <>
            <Button sx={{alignSelf: "end", marginLeft: "0.5em"}} color={"success"} variant={"contained"}
                    onClick={() => {
                        this.setState(({popupOpen: true}));
                    }}>
                Create group
            </Button>
            <ReactTable tableName={"user-groups"} headCells={["Group name", "Link"]} tableBody={this.tableBody}/>
            <Modal open={this.state.popupOpen} onClose={(() => this.setState(({popupOpen: false})))}>
                <ModalDialog>
                    <ModalClose accessKey={"x"}/>
                    <AddGroup/>
                </ModalDialog>
            </Modal>
        </>;
    }
}