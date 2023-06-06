import AddPlace from "../../components/place/AddPlace";
import Placemark from "../../domain/Placemark";
import LeafletMapAdapter from "./LeafletMapAdapter";

export default class LeafletPublicMapAdapter extends LeafletMapAdapter {

    /**
     * Navigates to the place creation form
     */
    protected override newPlace(e: React.MouseEvent): void {
        /* Navigate to form */
        if (this.state.currentPlacemark !== null) {
            this.setState({
                pageToShow:
                    <AddPlace public={true} open={true} map={this.map} placemark={this.state.currentPlacemark}
                                callback={this.addMarker.bind(this)}/>
            });
        }
    }


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
    }
}