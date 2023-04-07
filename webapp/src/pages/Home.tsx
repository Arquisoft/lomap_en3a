import React from "react";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import MapFilter from "../components/MapFilter";
import Map from "../domain/Map";
import Placemark from "../domain/Placemark";

export default class Home extends React.Component {
    private webID: string;
    private data: Map;

    public constructor(props: any) {
        super(props);
        this.webID = SolidSessionManager.getManager().getWebID();
        let map = new Map();
        map.add(new Placemark(43.5647300, -5.9473000, "Placemark 1"));
        map.add(new Placemark(43.5347300, -6.0473000, "Placemark 2"));
        map.add(new Placemark(43.6047300, -6.1473000, "Placemark 3"));
        map.add(new Placemark(43.5547300, -5.8473000, "Placemark 4"));
        map.add(new Placemark(43.4847300, -6.2473000, "Placemark 5"));
        this.data = map;
    }

    public render(): JSX.Element {
        return (
            <section className='Home'>
                <h2>Hello {this.webID}</h2>
                <div id="prueba">
                    <MapFilter></MapFilter>
                    <LeafletMapAdapter map={this.data}/>
                </div>
            </section>
        );
    }
}