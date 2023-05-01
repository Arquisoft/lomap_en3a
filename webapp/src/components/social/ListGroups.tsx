import React from "react";
import User from "../../domain/User";
import ReactTable from "../basic/ReactTable";
import {TableBody, TableCell, TableRow} from "@mui/material";
import LoadingPage from "../basic/LoadingPage";
import Button from "@mui/material/Button";
import AddGroup from "./AddGroup";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import PODManager from "../../adapters/solid/PODManager";
import Group from "../../domain/Group";
import GroupInfo from "./GroupInfo";
import EmptyList from "../basic/EmptyList";

interface ListGroupsProps {
    user: User,
    callback: (component: JSX.Element) => void
}

export default class ListGroups extends React.Component<ListGroupsProps, {
    page: number,
    loaded: boolean,
    popupOpen: boolean,
    tableBody: JSX.Element | null
}> {

    constructor(props: ListGroupsProps) {
        super(props);
        this.state = {
            page: 0,
            loaded: false,
            popupOpen: false,
            tableBody: null
        }

        this.testNoUse();
    }

    private testNoUse() {
        this.getGroups().then((groups) => {
            if (groups.length > 0) {
                let body: JSX.Element = (<TableBody>
                    {groups.map((group) => (
                        <TableRow key={group.getId()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                            <TableCell component="th" scope="row">
                                {group.getName()}
                            </TableCell>
                            <TableCell align="right">
                                <a onClick={() => {
                                    this.getGroupInfo(group)
                                }}>See info</a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>);
                this.setState(({
                    loaded: true,
                    tableBody: body
                }));
            }
        })
    }

    private getGroupInfo(group: Group) {
        this.props.callback(<GroupInfo group={group}/>);
    }

    private async getGroups() {
        return await new PODManager().getAllUserGroups();

    }

    render() {
        // Display while the data is fetched, remember to change the state to {loaded:true} so that
        // content is displayed instead of the LoadingPage
        if (!this.state.loaded) {
            return <LoadingPage size={100} style={{position: "absolute", left: "45%"}}/>;
        }
        return <div className={"group-list"}>
            <Button sx={{alignSelf: "end", marginLeft: "0.5em"}} color={"success"} variant={"contained"}
                    onClick={() => {
                        this.setState(({popupOpen: true}));
                    }}>
                Create group
            </Button>
            {this.state.tableBody == null ? <EmptyList firstHeader={"You don't have any group..."} image={"/globe.png"}
                                                       secondHeader={"Try adding some friends or creating one yourself!"}/> :
                <ReactTable id={"user-groups"} tableName={"user-groups"} headCells={["Group name", "Link"]}
                            tableBody={this.state.tableBody}/>}
            <Modal open={this.state.popupOpen} onClose={(() => {
                this.setState(({popupOpen: false}));
                this.testNoUse()
            })}>
                <ModalDialog>
                    <ModalClose accessKey={"x"}/>
                    <AddGroup/>
                </ModalDialog>
            </Modal>
        </div>;
    }
}