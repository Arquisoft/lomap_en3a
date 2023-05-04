import React from "react";
import User from "../../domain/User";
import {AppBar, Avatar, Dialog, IconButton, TableBody, TableCell, TableRow, Typography} from "@mui/material";
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
import PointInformation from "../../pages/PointInformation";
import Placemark from "../../domain/Placemark";
import EmptyList from "../basic/EmptyList";
import BackButton from "../basic/BackButton";

interface UserPageProps {
    user: User
}

interface UserPageState {
    placeShown: Place | null
    pageToChange: JSX.Element | null
    hasLoadedMaps: boolean,
    hasLoadedPlaces: boolean,
    maps: JSX.Element,
    showMapPopUp: boolean,
    mapForPopUp: Map | null,
    places: JSX.Element,
    shownPlaceMark: Placemark,
    openPointPopup: boolean,
    emptyMaps: boolean,
    emptyPlaces: boolean
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
            hasLoadedMaps: false,
            hasLoadedPlaces: false,
            maps: <></>,
            showMapPopUp: false,
            mapForPopUp: null,
            places: <></>,
            shownPlaceMark: new Placemark(0, 0, "Error"),
            openPointPopup: false,
            emptyMaps: false,
            emptyPlaces: false
        }
    }

    public async componentDidMount() {
        await this.loadMaps();
        await this.loadPlaces();
    }

    public async loadMaps() {
        // Get the maps from the user, update the pages of the tables
        let maps = await this.getMaps();
        if (maps.length === 0) {
            this.setState(({
                hasLoadedMaps: true,
                emptyMaps: true
            }));
            return;
        }
        this.setState(({
            hasLoadedMaps: true,
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
    }

    public async loadPlaces() {
        let places = await this.getPlaces();
        if (places.length === 0) {
            this.setState(({
                hasLoadedPlaces: true,
                emptyPlaces: true
            }));
        }
        let aux = (<TableBody>
            {places.map((place) => (
                <TableRow key={place.title} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                    <TableCell component="th" scope="row">{place.title}</TableCell>
                    <TableCell align="right">{place.description}</TableCell>
                    <TableCell align="right"><a onClick={() => {
                        this.showPlace(place);
                    }}>See place information</a></TableCell>
                </TableRow>
            ))}
        </TableBody>);
        this.setState(({
            places: aux,
            hasLoadedPlaces: true
        }))
    }

    private async getMaps() {
        return await new PODManager().getAllMaps(this.props.user.getWebId());
    }

    private async getPlaces() {
        return await new PODManager().getAllUserPlaces(this.props.user.getWebId());
    }

    private showMap(map: Map) {
        new PODManager().loadPlacemarks(map, this.props.user.getWebId()).then(() => {
            this.setState(({
                showMapPopUp: true,
                mapForPopUp: map
            }))
        });
    }

    private showPlace(place: Place) {
        let placeURL = new PODManager().getBaseUrl(this.props.user.getWebId()) + "/data/places/" + place.uuid;
        const placemark = new Placemark(place.latitude, place.longitude, place.title, placeURL);
        this.setState(({
            shownPlaceMark: placemark,
            openPointPopup: true
        }));
    }

    private handleClosePoint() {
        this.setState(({
            openPointPopup: false
        }))
    }

    render() {
        if (this.state?.pageToChange != null) {
            return this.state.pageToChange;
        }

        if (!this.state.hasLoadedMaps && !this.state.hasLoadedPlaces) {
            return <LoadingPage/>;
        }

        return (
            <>
                <BackButton onClick={() => {
                    this.setState({
                        placeShown: null,
                        pageToChange: (<Social/>)
                    })
                }}/>
                <main className="user-profile">
                    <h1>{this.props.user.getName() || "Unknown friend"}</h1>
                    <Avatar alt="User avatar"
                            src={this.props.user.photo}
                            sx={{
                                backgroundColor: "#B2CCEB",
                                width: 200,
                                height: 200,
                                fontSize: 100
                            }}>{this.props.user.getName()?.charAt(0)}</Avatar>
                    <h3 style={{color: "#2D2D2D", marginTop: 0, marginBottom: 0}}>{this.props.user.organization}</h3>
                    <h4 style={{color: "#505050", marginTop: 0, marginBottom: 0}}>{this.props.user.role}</h4>
                    <a href={this.props.user.getWebId()}>SOLID Profile</a>
                    <p style={{marginTop: 0}}>{this.props.user.note}</p>
                    {
                        this.state.emptyPlaces &&
                        <EmptyList firstHeader={"This user does not have any shared place..."} secondHeader={""}
                                   image={"marker_black.png"}/>
                    }
                    {!this.state.emptyMaps && !this.state.emptyPlaces &&
                        <div className="friends-tables">
                            <label htmlFor="places-table">{this.props.user.getName() || "Friend"}'s
                                Places</label>
                            <ReactTable tableName="places" tableBody={this.state.places}
                                        headCells={["Title", "Description", "Link"]}
                                        headerCellStyle={{color: "white"}} id={"places-table"}></ReactTable>
                            <label htmlFor="maps-table">{this.props.user.getName() || "Friend"}'s Maps</label>
                            <ReactTable tableName="maps" tableBody={this.state.maps}
                                        headCells={["Name", "Description", "Link"]}
                                        headerCellStyle={{color: "white"}} id={"maps-table"}></ReactTable>
                        </div>
                    }
                    {
                        this.state.emptyMaps &&
                        <EmptyList firstHeader={"This user does not have any shared map..."} secondHeader={""}
                                   image={"/map-magnifier.png"} imageStyle={{height: 100, width: 70}}/>
                    }
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
                            <Typography>
                                {this.state.mapForPopUp?.getName()}
                            </Typography>
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
                {this.state.openPointPopup && <PointInformation placemark={this.state.shownPlaceMark || undefined}
                                                                open={true} onBack={this.handleClosePoint.bind(this)}/>}
                <Footer style={{
                    backgroundColor: "#002E66",
                    color: "white",
                    textAlign: "center",
                    fontSize: "x-small",
                    height: "6em",
                    paddingTop: "0.3em"
                }}/>
            </>
        )
    }
}