import React from "react";
import ReactTable from "../basic/ReactTable";
import {TableBody, TableCell, TableRow} from "@mui/material";
import Button from "@mui/material/Button";
import Group from "../../domain/Group";
import PODManager from "../../adapters/solid/PODManager";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import LoadingPage from "../basic/LoadingPage";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import AddGroup from "./AddGroup";
import AddMap from "../map/AddMap";
import Social from "../../pages/Social";

export default class GroupInfo extends React.Component<{ group: Group }, {
    loading: boolean,
    emptyTable: JSX.Element | null,
    popupOpen: boolean,
    goBack: boolean
}> {

    private tableBody = <></>;

    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            emptyTable: null,
            popupOpen: false,
            goBack: false
        }

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
                // TODO change
                this.setState(({
                    emptyTable: <h2>This group has no maps</h2>
                }));
            }
            this.setState(({
                loading: false
            }));
        })

        this.createMapForGroup = this.createMapForGroup.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    private async getGroupMaps() {
        return await new PODManager().getGroupMaps(this.props.group);
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

        return (
            <section>
                <h2>{this.props.group.getName()}</h2>
                <p>Members in this group: {this.props.group.getMembers().length}</p>
                <Button onClick={this.createMapForGroup} variant={"contained"} color={"success"}>Create a map</Button>
                {
                    this.state.emptyTable != null ? this.state.emptyTable :
                        <ReactTable tableName={"group-maps"} headCells={["Title", "Description", "Link"]}
                                    tableBody={this.tableBody}/>
                }
                <Modal open={this.state.popupOpen} onClose={(() => this.setState(({popupOpen: false})))}>
                    <ModalDialog>
                        <ModalClose accessKey={"x"}/>
                        <AddMap group={this.props.group}/>
                    </ModalDialog>
                </Modal>
                <input type="button" id="back" value="Back" onClick={this.goBack}/>
            </section>
        );
    }

}