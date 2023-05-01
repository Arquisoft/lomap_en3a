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
import ReactTable from "../components/basic/ReactTable";
import {TableBody, TableCell, TableRow} from "@mui/material";
import EmptyList from "../components/basic/EmptyList";
import Social from "./Social";

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
            emptyListOfPoints: null
        };
        this.goBack = this.goBack.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBack = this.handleBack.bind(this);
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

    }

    public async componentDidMount() {
        await this.loadPlaceMarks(() => {
            this.setState({theMap: this.state.theMap, loadedPlaces: true});
        });
    }

    handleBack(prevComponent
                   :
                   JSX.Element
    ) {
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
                        <h1>Title: {this.state.theMap.getName()}</h1>
                        <h2>Description: {this.state.theMap.getDescription()}</h2>
                        <h2>Places:</h2>
                        {this.state.emptyListOfPoints || this.state.loadedPlaces &&
                            <div className="places-buttons">
                                <ReactTable tableName="places" tableBody={this.state.tablePlacesBody}
                                            headCells={["Title", " "]}
                                            headerCellStyle={{color: "white"}} id={"places-table"}></ReactTable>
                            </div>
                        }
                        {!this.state.loadedPlaces &&
                            <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>
                        }
                        {/*{this.props.map.isOwner(this.sessionManager.getWebID()) &&*/}
                        <div>
                            <h3>Change the visibility of the Map</h3>
                            <PrivacyComponent updatePrivacy={this.handleVisibilityChange}/>
                        </div>
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
            </>
        );
    }
}