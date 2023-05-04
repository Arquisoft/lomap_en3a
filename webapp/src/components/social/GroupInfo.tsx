import React from "react";
import ReactTable from "../basic/ReactTable";
import {AppBar, Button, Dialog, IconButton, TableBody, TableCell, TableRow, Toolbar, Typography} from "@mui/material";
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
import CloseIcon from "@mui/icons-material/Close";
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import LeafletMapAdapter from "../../adapters/map/LeafletMapAdapter";
import Footer from "../Footer";
import Map from "../../domain/Map";

export default class GroupInfo extends React.Component<{ group: Group }, {
    loading: boolean,
    popupOpen: boolean,
    goBack: boolean,
    isTableEmpty: boolean,
    members: User[],
    mapOpen: boolean,
    selectedMap: Map | undefined,
    loadedFriends: boolean
}> {

    private tableBody = <></>;
    private Transition = React.forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement;
        },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    });


    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
            popupOpen: false,
            goBack: false,
            isTableEmpty: false,
            members: [],
            mapOpen: false,
            selectedMap: undefined,
            loadedFriends: false
        }

        this.createMapForGroup = this.createMapForGroup.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        this.generateTable();
        this.loadMembers().then(() => {
            console.log("RELOAD")
            this.setState(({
                loadedFriends: true
            }));
        });
    }

    private async loadMembers() {
        await Promise.all(this.props.group.getMembers().map((member) => {
            this.getUsers("https://" + member.simplfiedWebID() + "/").then((user) => {
                this.setState((prevState) => {
                    prevState.members.push(user);
                });
            });
        }));
    }

    private generateTable() {
        this.getGroupMaps().then((maps) => {
            console.log(maps);
            if (maps.length > 0) {
                this.tableBody = (<TableBody>
                    {maps.map((map) => (
                        <TableRow key={map.getName()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                            <TableCell component="th" scope="row">{map.getName()}</TableCell>
                            <TableCell
                                align="right">{map.getDescription().length > 0 ? map.getDescription() : "No description given"}
                            </TableCell>
                            <TableCell align="right"><a onClick={() => {
                                this.showMap(map)
                            }}>See map</a></TableCell>
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
        }).catch(() => {
            this.setState(({
                isTableEmpty: true,
                loading: false
            }));
        });
    }

    private showMap(map: Map) {
        new PODManager().loadPlacemarks(map).then(() => {
            this.setState(({
                selectedMap: map,
                mapOpen: true
            }))
        });
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
                    <div className={"group-header"} style={{marginBottom: "1em"}}>
                        <h1>{this.props.group.getName()}</h1>
                        <h2 style={{margin: "0"}}>Members</h2>
                        <p style={{margin: "0"}}>Number of members: {this.props.group.getMembers().length}</p>
                        {this.state.loadedFriends && <FriendsList users={this.state.members}/>}
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
                    <Dialog
                        fullScreen
                        open={this.state.mapOpen}
                        onClose={() => {
                            this.setState(({mapOpen: false}))
                        }}
                        TransitionComponent={this.Transition}
                    >
                        <AppBar sx={{position: 'relative', backgroundColor: "#002E66"}}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={() => {
                                        this.setState(({mapOpen: false}))
                                    }}
                                    aria-label="close"
                                >
                                    <CloseIcon/>
                                </IconButton>
                                <Typography>
                                    {this.state.selectedMap?.getName()}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <LeafletMapAdapter map={this.state.selectedMap}/>
                        <Footer/>
                    </Dialog>
                </section>
                <Footer style={{
                    backgroundColor: "#002E66",
                    color: "white",
                    textAlign: "center",
                    fontSize: "x-small",
                    marginTop: "10%",
                    height: "10%"
                }}/>
            </>
        );
    }

}