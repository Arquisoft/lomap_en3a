import React, { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import PODManager from "../adapters/solid/PODManager";
import { getPlaces } from "../api/api";
import { PlaceType } from "../types/PlaceType";
import Map from "../domain/Map";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import Footer from "../components/Footer";
import MapFilter from "../components/MapFilter";
import PassmeDropdown from "../components/basic/PassmeDropdown";
import Placemark from "../domain/Placemark";
import LeafletPublicMapAdapter from "../adapters/map/LeafletPublicMapAdapter";
import { Button, Modal } from "@mui/material";
import { ModalDialog, ModalClose } from "@mui/joy";
import AddMap from "../components/map/AddMap";

interface PublicMapViewProps{
}

interface PublicMapViewState {
    filter: string[] | undefined,
    publicMap: Map,
    loadedMap: boolean,
    loading: boolean,
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
        };
    }

    public async componentDidMount(): Promise<void> {
        this.getPublicPlaces();
    }

    public async getPublicPlaces(): Promise<void> {
        console.log(this.state.publicMap?.getDescription())
        let places = await getPlaces();
        let Placemarks = new Array<Placemark>();
        places.forEach((place) => {
            Placemarks.push(new Placemark(place.latitude, place.longitude, place.title))
        });
        this.state.publicMap.setPlacemarks(Placemarks);
        this.setState({loadedMap: true, loading: false});
    }

    private setFilter(categories: string[] | undefined): void {
        this.setState({filter: categories});
    }

    public render(): JSX.Element {
        return (
            <section className='Home'>
              <div className="map-header">
                {this.state.loading && <h2>Loading...</h2>}
                <div className="map-options">
                    <PassmeDropdown presentMe={<MapFilter callback={this.setFilter.bind(this)}/>}
                                  buttonText={"Show Filters"}/>
                </div>
                </div>
                <div className="content">
                    {this.state.loadedMap && <LeafletPublicMapAdapter map={this.state.publicMap} categories={this.state.filter}/>}
                </div>
                <Footer style={{
                    backgroundColor: "#002E66",
                    color: "white",
                    textAlign: "center",
                    fontSize: "x-small",
                    height: "6em",
                    paddingTop: "0.3em"
                }}/>
            </section>
        );
    }
}