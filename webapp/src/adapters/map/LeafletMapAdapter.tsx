import 'leaflet/dist/leaflet.css';
import {LayerGroup, MapContainer, Marker, Popup, TileLayer, useMapEvents} from 'react-leaflet';
import Map from "../../domain/Map";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import currentMarkerPng from "../../assets/map/new_marker.png"
import {Icon, LatLngExpression, LeafletMouseEvent} from 'leaflet';
import React from 'react';
import Placemark from '../../domain/Placemark';
import NewPlacePopup from '../../components/NewPlacePopup';
import AddPlace from '../../pages/AddPlace';
import PointInformation from '../../pages/PointInformation';
import Place from '../../domain/Place';
import PODManager from '../solid/PODManager';
import MapFilter from '../../components/MapFilter';


/**
 * An optional map with the initial markers can be passed as a prop
 */
interface LeafletMapAdapterProps {
    map?: Map;
    categories?: string[]
}

/**
 * Stores an array with the marker components in its state
 */
interface LeafletMapAdapterState {
    pageToShow: JSX.Element | undefined;
    currentPlacemark: Placemark | null;
}

/**
 * Empty component used to manage leaflet events.
 * Must be included in render().
 *
 * @param props the function to be called for each event.
 * @returns null, the component won't be displayed
 */
const Handler = (props: any) => {
    useMapEvents({
        click(e) {
            props.click(e)
        }
    });
    return (null);
}

/**
 * Shows and manages the events of a Leaflet map
 */
export default class LeafletMapAdapter extends React.Component<LeafletMapAdapterProps, LeafletMapAdapterState> {
    private defaultIcon: Icon = new Icon({iconUrl: markerIconPng, iconSize: [30, 50], iconAnchor: [15, 50]});
    private currentIcon: Icon = new Icon({iconUrl: currentMarkerPng, iconSize: [30, 50], iconAnchor: [15, 50]});
    private map: Map;
    private pod: PODManager = new PODManager();

    public constructor(props: LeafletMapAdapterProps) {
        super(props);
        this.map = (props.map !== undefined) ? props.map : new Map('TestMap');
        this.state = {
            pageToShow: undefined,
            currentPlacemark: null,
        };
    }

    private isFiltered(p: Placemark): boolean {
        if (this.props.categories !== undefined) {
            console.log(p.getCategory())
            console.log(this.props.categories)
            console.log(p.getCategory() in this.props.categories)
            return this.props.categories.indexOf( p.getCategory() ) != -1;
        }
        return true;
    }

    /**
     * Updates the current placemark with the selected place
     * @param {LeafletMouseEvent} e the Leaflet event with the coordinates of the click
     */
    private updateCurrentPlacemark(e: LeafletMouseEvent): void {
        if (!e.originalEvent.defaultPrevented) {
            this.setState({currentPlacemark: new Placemark(e.latlng.lat, e.latlng.lng)});
        }
    }

    /**
     * Generates a react Marker component from a Placemark object.
     * @param {Placemark} placemark  the placemark to be displayed
     * @returns {JSX.Element} the Marker component created from the placemark
     */
    private generateDefaultMarker(placemark: Placemark): JSX.Element {
        return (
            <Marker position={[placemark.getLat(), placemark.getLng()]} icon={this.defaultIcon}>
                <Popup offset={[0, -50]}>
                    <h1>{placemark.getTitle()}</h1>
                    <button onClick={async () => {
                        this.setState({pageToShow:
                             <PointInformation map={this.map} placemark={placemark}/>
                        });
                    }}>Get Info
                    </button>
                </Popup>
            </Marker>
        )
            ;
    }

    /**
     * Generates a react Marker component at the selected location.
     * @returns a Marker component if any location selected, else null
     */
    private generateMarkerNewPlace(): JSX.Element | null {
        let placemark: Placemark | null = this.state.currentPlacemark;
        if (placemark === null) return null;

        return (
            <Marker position={[placemark.getLat(), placemark.getLng()]} icon={this.currentIcon}>
                <Popup offset={[0, -50]}>
                    <NewPlacePopup new={this.newPlace.bind(this)} cancel={this.cancel.bind(this)}/>
                </Popup>
            </Marker>
        );
    }

    /**
     * Navigates to the place creation form
     */
    private newPlace(e: React.MouseEvent): void {
        /* Navigate to form */
        if (this.state.currentPlacemark !== null) {
            this.setState({pageToShow: 
                <AddPlace placemark={this.state.currentPlacemark} callback={this.addMarker.bind(this)}/>
            });
        }
    }

    private addMarker(p: Placemark): void {
        console.log(p.getCategory())
        this.map.add(p);
        this.pod.saveMap(this.map);
        this.setState({
            pageToShow: undefined,
            currentPlacemark: null,
        });
    }

    private getCenter(): LatLngExpression {
        let length: number = this.map.getPlacemarks().length;

        if (length == 0) {
            return [43.5547300, -5.9248300] // Avilés
        }
        let last = this.map.getPlacemarks()[length - 1];
        return [last.getLat(), last.getLng()];
    }

    private generateMarkers(): JSX.Element[] {
        return this.map.getPlacemarks()
            .filter(p => this.isFiltered(p))
            .map((p) => this.generateDefaultMarker(p))
    }

    /**
     * Cancels the new place creation
     */
    private cancel(e: React.MouseEvent): void {
        this.setState({currentPlacemark: null});
        e.preventDefault();
    }

    public render(): JSX.Element {
        if (this.state.pageToShow != undefined) {
            return this.state.pageToShow;
        }
        return (
            <div>
                <MapContainer style={{height: '75vh', width: '100%', zIndex: "0"}} center={this.getCenter()} zoom={13}>
                    <Handler click={this.updateCurrentPlacemark.bind(this)}/>
                    <TileLayer
                        attribution={'<a href="https://www.openstreetmap.org/copyright"> OpenStreetMap</a> contributors'}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LayerGroup>{this.generateMarkerNewPlace()}{this.generateMarkers()}</LayerGroup>
                </MapContainer>
            </div>
        );
    }
}

