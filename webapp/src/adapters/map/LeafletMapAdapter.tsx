import 'leaflet/dist/leaflet.css';
import { LayerGroup, MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import React from 'react';
import Map from "../../domain/Map";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import Placemark from '../../domain/Placemark';

/**
 * An optional map with the initial markers can be passed as a prop
 */
interface LeafletMapAdapterProps {
    map?: Map;
}

/**
 * Shows and manages the events of a Leaflet map
 */
export default class LeafletMapAdapter extends React.Component<LeafletMapAdapterProps> {
    private defaultIcon: Icon = new Icon({iconUrl: markerIconPng, iconSize: [30, 50], iconAnchor: [15, 50]});
    private map: Map;

    public constructor(props: LeafletMapAdapterProps) {
        super(props);
        this.map = (props.map !== undefined) ? props.map : new Map(); 
    }

    /**
     * Generates a react Marker component from a Placemark object.
     * @param {Placemark} placemark  the placemark to be displayed
     * @returns {JSX.Element} the Marker component created from the placemark
     */
    private generateDefaultMarker(placemark: Placemark): JSX.Element {
        return (
        <Marker  position={[placemark.getLat(), placemark.getLng()]} icon={this.defaultIcon}>
            <Popup offset={[0,-50]}>{placemark.getTitle()}</Popup>
        </Marker>
        );
    }

    public render(): JSX.Element {
        return (
            <MapContainer style={{ height: '75vh', width: '100%' }} center={[43.5547300, -5.9248300]} zoom={13} >
                <TileLayer  
                    attribution={'<a href="https://www.openstreetmap.org/copyright"> OpenStreetMap</a> contributors'}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LayerGroup >
                    {this.map.getPlacemarks().map(placemark => this.generateDefaultMarker(placemark))}
                </LayerGroup>
            </MapContainer>
        );
    }
}
