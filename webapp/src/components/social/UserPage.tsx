import React from "react";
import User from "../../domain/User";
import {AppBar, Avatar, Dialog, IconButton, TableBody, TableCell, TableRow} from "@mui/material";
import Place from "../../domain/Place";
import Map from "../../domain/Map";
import ReactTable from "../basic/ReactTable";
import "../../styles/userProfile.css";
import Social from "../../pages/Social";
import PODManager from "../../adapters/solid/PODManager";
import LoadingPage from "../basic/LoadingPage";
import LeafletMapAdapter from "../../adapters/map/LeafletMapAdapter";
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from '@mui/material/Toolbar';
import Footer from "../Footer";

interface UserPageProps {
    user: User
}

interface UserPageState {
    placeShown: Place | null
    pageToChange: JSX.Element | null
    hasLoaded: boolean,
    maps: JSX.Element,
    showMapPopUp: boolean,
    mapForPopUp: Map | null
}

/**
 * This class is set to present the page of a given user in the props
 * @param {User} user - The user to be presented in the page
 * @author UO283069
 */
export default class UserPage extends React.Component<UserPageProps, UserPageState> {

    private Transition = React.forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement;
        },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    constructor(props: UserPageProps) {
        super(props);
        this.state = {
            placeShown: null,
            pageToChange: null,
            hasLoaded: false,
            maps: <></>,
            showMapPopUp: false,
            mapForPopUp: null
        }

        // Get the maps from the user, update the pages of the tables
        this.getMaps().then((maps) => {
            console.log(maps);
            this.setState(({
                hasLoaded: true,
                maps: (<TableBody>
                    {maps.map((map) => (
                        <TableRow key={map.getName()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                            <TableCell component="th" scope="row">{map.getName()}</TableCell>
                            <TableCell align="right">{map.getDescription()}</TableCell>
                            <TableCell align="right"><a onClick={() => {
                                this.showMap(map);
                            }}>See map</a></TableCell>
                        </TableRow>
                    ))}
                </TableBody>)
            }));

        }).catch(() => {
            this.setState(({
                pageToChange: (<h1>There was a problem</h1>)
            }));
        });

    }

    private async getMaps() {
        return await new PODManager().getAllMaps(this.props.user.getWebId());
    }

    private showMap(map: Map) {
        new PODManager().loadPlacemarks(map, this.props.user.getWebId()).then(() => {
            this.setState(({
                showMapPopUp: true,
                mapForPopUp: map
            }))
        });
    }

    render() {
        if (this.state?.pageToChange != null) {
            return this.state.pageToChange;
        }

        if (!this.state.hasLoaded) {
            return <LoadingPage/>;
        }

        return (
            <>
                <div className="back-page-link-container" onClick={() => {
                    this.setState({
                        placeShown: null,
                        pageToChange: (<Social/>)
                    })
                }}>
                    <a className="back-page-link">Friends list</a>
                </div>
                <main className="user-profile">
                    <h1>{this.props.user.getName()}</h1>
                    <Avatar alt="User avatar"
                            sx={{
                                backgroundColor: "#B2CCEB",
                                width: 200,
                                height: 200,
                                fontSize: 100
                            }}>{this.props.user.getName()?.charAt(0)}</Avatar>
                    <a href={this.props.user.getWebId()}>SOLID Profile</a>
                    <div className="friends-tables">
                        <label htmlFor="maps-table">Friends maps</label>
                        <ReactTable tableName="places" tableBody={this.state.maps}
                                    headCells={["Name", "Description", "Link"]}
                                    headerCellStyle={{color: "white"}} id={"maps-table"}></ReactTable>
                    </div>
                </main>
                <Dialog
                    fullScreen
                    open={this.state.showMapPopUp}
                    onClose={() => {
                        this.setState(({showMapPopUp: false}))
                    }}
                    TransitionComponent={this.Transition}
                >
                    <AppBar sx={{position: 'relative', backgroundColor: "#002E66"}}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => {
                                    this.setState(({showMapPopUp: false}))
                                }}
                                aria-label="close"
                            >
                                <CloseIcon/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <LeafletMapAdapter map={this.state.mapForPopUp !== null ? this.state.mapForPopUp : undefined}/>
                    <Footer style={{
                        backgroundColor: "#002E66",
                        color: "white",
                        textAlign: "center",
                        fontSize: "x-small",
                        height: "100%"
                    }}/>
                </Dialog>
            </>)
    }
}