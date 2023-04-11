import React from "react";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import MapFilter from "../components/MapFilter";
import Map from "../domain/Map";
import PODManager from "../adapters/solid/PODManager";
import { ChangeEvent } from "react";
import Placemark from "../domain/Placemark";
import {PlaceType} from "../types/PlaceType";


interface HomeProps {
    placeList? : PlaceType[]
}

export default class Home extends React.Component<HomeProps,{data:Map|undefined}> {
    private podManager = new PODManager();
    private webID: string;
    private maps: Array<Map>;
    private data: Map;
    static defaultProps = {
        placeList : []
    }

    public constructor(props : any) {
        super(props);
        this.webID = SolidSessionManager.getManager().getWebID();
        this.maps = new Array();
        this.state = {
            data: undefined
        };

        let map = new Map("Public map");
        let places : Array<PlaceType> = props.placeList;
        let placemarks : Array<Placemark> = places.map((place) => {
            return new Placemark(place.latitude, place.longitude, place.title);
        })
        placemarks.forEach((placemark) => map.add(placemark));
        map.add(new Placemark(43.5647300, -5.9473000, "Placemark 1"));
        map.add(new Placemark(43.5347300, -6.0473000, "Placemark 2"));
        map.add(new Placemark(43.6047300, -6.1473000, "Placemark 3"));
        map.add(new Placemark(43.5547300, -5.8473000, "Placemark 4"));
        map.add(new Placemark(43.4847300, -6.2473000, "Placemark 5"));
        this.data = map;
    }

    public async componentDidMount(): Promise<void> {
        this.maps = await this.podManager.getAllMaps();
        let map = (this.maps.length > 0) ? this.maps[0] : new Map('TestMap');;
        await this.podManager.loadPlacemarks(map);
        this.setState({data: map});
    }

    private async changeMap(event: ChangeEvent): Promise<void> {
        let select:HTMLSelectElement = (event.target as HTMLSelectElement);
        let index:number = select.selectedIndex;
        let id:string = select.options[index].value;
        let map:Map|undefined = this.maps.find(m => m.getId() == id);

        if (map !== undefined) {
            this.setState({data: undefined});
            await this.podManager.loadPlacemarks(map);
            this.setState({data: map});
        }
    }

    public render(): JSX.Element {
        return (
            <section className='Home'>
                <MapFilter></MapFilter>
                <button onClick={async () => {await this.podManager.saveMap(new Map("Initial map"))}}>Save</button>
                <h2>{this.state.data?.getName() || "Loading"}</h2>
                {this.state.data !== undefined &&
                <div>
                    <select name="map" onChange={this.changeMap.bind(this)}>
                        {this.maps.map(m => {
                            return (<option value={m.getId()}>{m.getName()}</option>)
                        })}
                    </select>
                    <LeafletMapAdapter map={this.state.data}/>
                </div>}
                <input type="button" value="set public" onClick={async () => {await this.podManager.setPublicAccess(this.podManager.getBaseUrl()+"/data/maps/"+this.maps[0].getId(), true)}} />
                <input type="button" value="set private" onClick={async () => {await this.podManager.setPublicAccess(this.podManager.getBaseUrl()+"/data/maps/"+this.maps[0].getId(), false)}} />
            </section>
        );
    }
}