import React from "react";
import ReactTable from "../basic/ReactTable";
import {Button, TableBody, TableCell, TableRow} from "@mui/material";
import Group from "../../domain/Group";
import PODManager from "../../adapters/solid/PODManager";
import {Simulate} from "react-dom/test-utils";
import LoadingPage from "../basic/LoadingPage";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import AddMap from "../map/AddMap";
import Social from "../../pages/Social";
import EmptyList from "../basic/EmptyList";
import BackButton from "../basic/BackButton";
import FriendsList from "./FriendsList";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";

export default class GroupInfo extends React.Component<{ group: Group }, {
    loading: boolean,
    popupOpen: boolean,
    goBack: boolean,
    isTableEmpty: boolean,
    members: User[]
}> {

    private tableBody = <></>;

    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            popupOpen: false,
            goBack: false,
            isTableEmpty: false,
            members: []
        }

        this.generateTable();

        for (let i = 0; i < this.props.group.getMembers().length; i++) {
            this.getUsers("https://" + this.props.group.getMembers()[i].simplfiedWebID() + "/").then((user) => {
                this.setState((prevState) => {
                    prevState.members.push(user);
                });
            });

        }

        this.createMapForGroup = this.createMapForGroup.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    private generateTable() {
        this.getGroupMaps().then((maps) => {
            if (maps.length > 0) {
                this.tableBody = (<TableBody>
                    {maps.map((map) => (
                        <TableRow key={map.getName()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                            <TableCell component="th" scope="row">{map.getName()}</TableCell>
                            <TableCell
                                align="right">{map.getDescription().length > 0 ? map.getDescription() : "No description given"}
                            </TableCell>
                            <TableCell align="right"><a>See map</a></TableCell>
                        </TableRow>
                    ))}
                </TableBody>);
            } else {
                this.setState(({
                    isTableEmpty: true
                }));
            }
            this.setState(({
                loading: false
            }));
        })
    }

    private async getGroupMaps() {
        return await new PODManager().getGroupMaps(this.props.group);
    }

    private async getUsers(webID: string) {
        return await new FriendManager().getUserData(webID);
    }

    /*
    * When the button create map is pressed, the popup is opened
    */
    private createMapForGroup() {
        this.setState(({
            popupOpen: true
        }));
    }

    goBack() {
        this.setState(({
            goBack: true
        }));
    }

    render() {
        if (this.state.goBack) {
            return <Social/>;
        }
        if (this.state.loading) {
            return <div><LoadingPage/></div>;
        }
        return (<>
                <BackButton onClick={this.goBack}/>
                <section style={{margin: "0 1em 0 1em"}}>
                    <div className={"group-header"}
                         style={{display: "flex", flexDirection: "row", alignItems: "stretch"}}>
                        <div>
                            <h2>{this.props.group.getName()}</h2>
                            <p>Members in this group: {this.props.group.getMembers().length}</p>
                        </div>
                        <aside style={{alignSelf: "end", marginLeft: "50%"}}>
                            <h3>Members</h3>
                            <FriendsList users={this.state.members}/>
                        </aside>
                    </div>
                    <Button onClick={this.createMapForGroup} variant={"contained"} color={"success"}>Create a
                        map</Button>
                    {
                        this.state.isTableEmpty ?
                            <EmptyList firstHeader={"This group does not have maps..."} image={"/map-magnifier.png"}
                                       secondHeader={"Try adding some!"}/> :
                            <ReactTable tableName={"group-maps"} headCells={["Title", "Description", "Link"]}
                                        tableBody={this.tableBody}/>
                    }
                    <Modal open={this.state.popupOpen} onClose={(() => {
                        this.setState(({popupOpen: false}));
                        this.generateTable();
                    })}>
                        <ModalDialog>
                            <ModalClose accessKey={"x"}/>
                            <AddMap group={this.props.group}/>
                        </ModalDialog>
                    </Modal>
                </section>
            </>
        );
    }

}