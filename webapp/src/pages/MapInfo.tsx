import React from "react";
import "../styles/mapInfo.css";
import Map from "../domain/Map";
import PODManager from "../adapters/solid/PODManager";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import UserStuff from "./UserStuff";
import PrivacyComponent from "../components/place/PrivacyComponent";
import User from "../domain/User";
import Placemark from "../domain/Placemark";
import PointInformation from "./PointInformation";
import LoadingPage from "../components/basic/LoadingPage";
import Footer from "../components/Footer";
import {TableBody, TableCell, TableRow} from "@mui/material";
import EmptyList from "../components/basic/EmptyList";
import Group from "../domain/Group";

interface MapInfoProps {
    map: Map;
}

interface MapInfoState {
    goBack: boolean;
    visibility: string;
    pod: PODManager;
    theMap: Map;
    open: boolean;
    selectedPlacemark: Placemark;
    currentComponent: JSX.Element;
    loadedPlaces: boolean;
    friends: User[];
    tablePlacesBody: JSX.Element,
    emptyListOfPoints: JSX.Element | null
}

export default class MapInfo extends React.Component<MapInfoProps, MapInfoState> {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    public constructor(props: any) {
        super(props);
        this.state = {
            goBack: false,
            visibility: "",
            pod: new PODManager(),
            theMap: this.props.map,
            open: false,
            selectedPlacemark: new Placemark(0, 0),
            currentComponent: <div/>,
            loadedPlaces: false,
            tablePlacesBody: <></>,
            emptyListOfPoints: null,
            friends: [],
        };
        this.goBack = this.goBack.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleVisibility = this.handleVisibility.bind(this);
    }

    private async loadPlaceMarks(callback: () => void) {
        await this.state.pod.loadPlacemarks(this.state.theMap);
        if (this.state.theMap.getPlacemarks().length > 0) {
            this.setState(({
                tablePlacesBody: (<TableBody>
                    {this.state.theMap.getPlacemarks().map((placemark) => (
                        <TableRow key={placemark.getTitle()} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                            <TableCell component="th" scope="row">{placemark.getTitle()}</TableCell>
                            <TableCell align="right">
                                <button
                                    onClick={() => this.setState({open: true, selectedPlacemark: placemark})}
                                    type="submit">
                                    See detail...
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>)
            }));
        } else {
            this.setState(({
                emptyListOfPoints: (<EmptyList firstHeader={"There are no places in this map..."}
                                               secondHeader={"Try adding some!"}
                                               image={"/marker_black.png"}
                                               imageStyle={{
                                                   width: "100px",
                                                   height: "194px",
                                                   marginLeft: "2em",
                                                   alignSelf: "end"
                                               }}/>)
            }))
        }

        callback();
    }

    private goBack() {
        this.setState({goBack: true});
    }

    private handleVisibilityChange = (privacy: string, friends: User[]) => {
        this.setState({visibility: privacy, friends: friends});
    }

    private handleVisibility() {
        let mapUrl = this.state.pod.getBaseUrl() + '/data/maps/' + this.props.map.getId();
        switch (this.state.visibility) {
            case "public":
                this.state.pod.setPublicAccess(mapUrl, true);
                break;
            case "private":
                this.state.pod.setPublicAccess(mapUrl, false);
                break;
        }

        if (this.state.friends.length > 0) {
            let group = new Group("", this.state.friends);
            this.state.pod.setGroupAccess(mapUrl, group, {read: true});
        }

    }

    public async componentDidMount() {
        await this.loadPlaceMarks(() => {
            this.setState({theMap: this.state.theMap, loadedPlaces: true});
        });
    }

    handleBack(prevComponent: JSX.Element) {
        this.setState({open: false});
    }

    /**
     * Returns the map information view
     */
    public render() {
        if (this.state.goBack) {
            return <UserStuff/>;
        }
        return (<>
            <div className="back-page-link-container" id="back" onClick={this.goBack}>
                <a className="back-page-link">Back</a>
            </div>
            <section className="my-stuff">
                <div className="mapInformation">
                    <h1>{this.state.theMap.getName()}</h1>
                    <h3>{this.state.theMap.getDescription()}</h3>
                    <h2>Places:</h2>
                    {/*For each place from the map an item will be a row with the name in a table, and a button to open a component PointInformation*/}
                    {this.state.loadedPlaces &&
                        <div className="places-buttons">
                            {this.state.theMap.getPlacemarks().map((placemark) => (
                                <div className="place-button">
                                    <h3>{placemark.getTitle()}</h3>
                                    <button onClick={() => this.setState({open: true, selectedPlacemark: placemark})}
                                            type="submit">
                                        See detail
                                    </button>
                                </div>
                            ))
                            }
                        </div>
                    }
                    {!this.state.loadedPlaces &&
                        <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>
                    }
                    {this.state.loadedPlaces &&
                        this.state.theMap.getPlacemarks().length === 0 &&
                        <p>There are no places in this map</p>
                    }
                    {/*{this.props.map.isOwner(this.sessionManager.getWebID()) &&*/}
                    <div id="visibility">
                        <h3>Change the visibility of the Map</h3>
                        <PrivacyComponent updatePrivacy={this.handleVisibilityChange}/>
                    </div>
                </div>
                <div>
                    <input type="button" id="confirm" value="Confirm change" onClick={this.handleVisibility}/>
                </div>
                {this.state.open && (
                    <PointInformation prevComponent={this.state.currentComponent}
                                      map={this.state.theMap}
                                      placemark={this.state.selectedPlacemark}
                                      open={true}
                                      onBack={this.handleBack}/>
                )}
            </section>
            <Footer style={{
                backgroundColor: "#002E66",
                color: "white",
                textAlign: "center",
                fontSize: "x-small",
                height: "6em",
                paddingTop: "0.3em"
            }}/>
        </>);
    }
}