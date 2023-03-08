import 'leaflet/dist/leaflet.css';
import { LayerGroup, MapContainer, Marker, TileLayer} from 'react-leaflet';
import React from 'react';


/**
 * Shows and manages the events of a Leaflet map
 */
export default class LeafletMapAdapter extends React.Component {

    public render(): JSX.Element {
        return (
            <MapContainer style={{ height: '75vh', width: '100%' }} center={[43.5547300, -5.9248300]} zoom={13} >
                <TileLayer  
                    attribution={'<a href="https://www.openstreetmap.org/copyright"> OpenStreetMap</a> contributors'}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LayerGroup ><Marker position={[43.5547300, -5.9248300]}></Marker></LayerGroup>
            </MapContainer>
        );
    }
}
