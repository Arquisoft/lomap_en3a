import Placemark from "../../domain/Placemark";
import LeafletMapAdapter from "./LeafletMapAdapter";
import { addPlace } from "../../api/api";
import {PlaceType} from "../../types/PlaceType";

export default class LeafletPublicMapAdapter extends LeafletMapAdapter {
    
    /**
     * Override the addMarker method to add the marker to the map
     * @param p 
     */
    public override addMarker(p: Placemark): void {
        this.map.add(p);
        this.setState({
            pageToShow: undefined,
            currentPlacemark: null,
        });
        addPlace({title: p.getTitle(), uuid: p.getPlaceUrl(), longitude: p.getLng(), latitude: p.getLat()});
    }
}