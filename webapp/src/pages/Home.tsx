import React from "react";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import MapFilter from "../components/MapFilter";
import Map from "../domain/Map";
import PODManager from "../adapters/solid/PODManager";
import { ChangeEvent } from "react";
import Placemark from "../domain/Placemark";
import {PlaceType} from "../types/PlaceType";


interface HomeProps {
    placeList? : PlaceType[]
}

interface HomeState {
    data: Map | undefined, 
    filter: string[] | undefined,
    maps: Map[]
}

export default class Home extends React.Component<HomeProps,HomeState> {
    private podManager = new PODManager();
    static defaultProps = {
        placeList : []
    }

    public constructor(props : any) {
        super(props);

        let map = new Map("Public map");
        let places : Array<PlaceType> = props.placeList;
        places.forEach((place) => map.add(
            new Placemark(place.latitude, place.longitude, place.title)
        ));

        this.state = {
            data: map,
            filter: undefined,
            maps: []
        };
    }

    public async componentDidMount(): Promise<void> {
        let maps = await this.podManager.getAllMaps();

        if (this.state.data !== undefined) {
            maps = [this.state.data, ...maps]
        }
        this.setState({maps: maps})
    }

    private async changeMap(event: ChangeEvent): Promise<void> {
        let select:HTMLSelectElement = (event.target as HTMLSelectElement);
        let index:number = select.selectedIndex;
        let id:string = select.options[index].value;
        let map:Map|undefined = this.state.maps.find(m => m.getId() == id);

        if (map !== undefined) {
            this.setState({data: undefined});
            await this.podManager.loadPlacemarks(map);
            this.setState({data: map});
        }
    }

    private setFilter(categories: string[]|undefined): void {
        this.setState({filter: categories});
    }

    public render(): JSX.Element {
        return (
            <section className='Home'>
                <h2>{this.state.data?.getName() || "Loading"}</h2>
                <select name="map" onChange={this.changeMap.bind(this)}>
                        {this.state.maps.map(m => {
                            return (<option value={m.getId()}>{m.getName()}</option>)
                        })}
                </select>
                <div>
                    <button onClick={async () => {await this.podManager.saveMap(new Map("New map"))}}>New map</button>
                    <input type="button" value="set public" onClick={async () => {await this.podManager.setPublicAccess(this.podManager.getBaseUrl()+"/data/maps/"+(this.state.data as Map).getId(), true)}} />
                    <input type="button" value="set private" onClick={async () => {await this.podManager.setPublicAccess(this.podManager.getBaseUrl()+"/data/maps/"+(this.state.data as Map).getId(), false)}} />
                    <input type="button" onClick={() => this.setFilter(["a"])} />
                </div>
                
                {this.state.data !== undefined &&
                <div>
                    <div className = "content">
                        <MapFilter callback={this.setFilter.bind(this)}/>
                        <div className="map">
                            <LeafletMapAdapter map={this.state.data} categories={this.state.filter} />
                        </div>
                    </div>
                </div>}
            </section>
        );
    }
}