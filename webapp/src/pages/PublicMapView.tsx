import React from "react";
import PODManager from "../adapters/solid/PODManager";
import {getPlaces} from "../api/api";
import Map from "../domain/Map";
import Footer from "../components/Footer";
import MapFilter from "../components/map/MapFilter";
import PassmeDropdown from "../components/basic/PassmeDropdown";
import Placemark from "../domain/Placemark";
import LeafletPublicMapAdapter from "../adapters/map/LeafletPublicMapAdapter";
import {Button, Modal} from "@mui/material";
import {ModalDialog, ModalClose} from "@mui/joy";
import AddMap from "../components/map/AddMap";
import EmptyList from "../components/basic/EmptyList";
import LoadingPage from "../components/basic/LoadingPage";

interface PublicMapViewProps {
}

interface PublicMapViewState {
    filter: string[] | undefined,
    publicMap: Map,
    loadedMap: boolean,
    loading: boolean,
    mapLoaded: boolean
}

export default class PublicMapView extends React.Component<PublicMapViewProps, PublicMapViewState> {
    podManager: PODManager;

    constructor(props: any) {
        super(props);
        this.podManager = new PODManager();
        this.state = {
            filter: undefined,
            publicMap: new Map("Public map", "The generated public map"),
            loadedMap: false,
            loading: true,
            mapLoaded: true,
        };
    }

    public componentDidMount() {
        this.getPublicPlaces().then(() => {
            if (this.state.publicMap.getPlacemarks().length === 0) {
                this.setState(({
                    mapLoaded: false,
                    loading: false
                }))
            }
        }).catch(() => {
            this.setState(({
                mapLoaded: false,
                loading: false
            }))
        });
    }

    public async getPublicPlaces(): Promise<void> {
        let places = await getPlaces();
        let Placemarks = new Array<Placemark>();
        places.forEach((place) => {
            Placemarks.push(place)
        });
        this.state.publicMap.setPlacemarks(Placemarks);
        this.setState({loadedMap: true, loading: false});
    }

    private setFilter(categories: string[] | undefined): void {
        this.setState({filter: categories});
    }

    public render(): JSX.Element {

        if (this.state.loading) {
            return <LoadingPage/>;
        }


        if (!this.state.mapLoaded) {
            return <><EmptyList firstHeader={"We seem to be having trouble with our services"}
                                secondHeader={"Please try again later!"} image={"/sad_face.webp"}
                                imageStyle={{width: 231, height: 231}}/><Footer style={{
                backgroundColor: "#002E66",
                color: "white",
                textAlign: "center",
                fontSize: "x-small",
                marginTop: "20%", height: "10%"
            }}/></>
        }

        return (
            <section className='Home' style={{height: "100%"}}>
                <div className={"map-header"} style={{height: "0.3em", margin: 0}}/>
                <div className="map-options" style={{position: "absolute", zIndex: "1", left: "2em", top: "6.7em"}}>
                    <PassmeDropdown presentMe={<MapFilter callback={this.setFilter.bind(this)}/>}
                                    buttonText={"Show Filters"}/>
                </div>
                <div className="content">
                    {this.state.loadedMap &&
                        <LeafletPublicMapAdapter map={this.state.publicMap} categories={this.state.filter}/>}
                </div>
                <Footer style={{
                    backgroundColor: "#002E66",
                    color: "white",
                    textAlign: "center",
                    fontSize: "x-small",
                    height: "7em",
                    paddingTop: "0.3em"
                }}/>
            </section>
        );
    }
}