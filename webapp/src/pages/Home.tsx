import React, {ChangeEvent} from "react";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import MapFilter from "../components/MapFilter";
import Map from "../domain/Map";
import PODManager from "../adapters/solid/PODManager";
import Placemark from "../domain/Placemark";
import {PlaceType} from "../types/PlaceType";
import PassmeDropdown from "../components/basic/PassmeDropdown";
import Footer from "../components/Footer";


interface HomeProps {
    placeList?: PlaceType[]
}

interface HomeState {
    data: Map | undefined,
    filter: string[] | undefined,
    maps: Map[]
}

export default class Home extends React.Component<HomeProps, HomeState> {
    private podManager = new PODManager();
    static defaultProps = {
        placeList: []
    }

    public constructor(props: any) {
        super(props);

        let map = new Map("Public map");
        let places: Array<PlaceType> = props.placeList;
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
        let select: HTMLSelectElement = (event.target as HTMLSelectElement);
        let index: number = select.selectedIndex;
        let id: string = select.options[index].value;
        let map: Map | undefined = this.state.maps.find(m => m.getId() == id);

        if (map !== undefined) {
            this.setState({data: undefined});
            await this.podManager.loadPlacemarks(map);
            this.setState({data: map});
        }
    }

    private setFilter(categories: string[] | undefined): void {
        this.setState({filter: categories});
    }

    public render(): JSX.Element {
        return (
            <section className='Home'>
                <div className="map-header">
                    <h2>{this.state.data?.getName() || "Loading"}</h2>
                    <div className="map-options">
                        <select name="map" onChange={this.changeMap.bind(this)}>
                            {this.state.maps.map(m => {
                                return (<option value={m.getId()}>{m.getName()}</option>)
                            })}
                        </select>
                        <PassmeDropdown presentMe={<MapFilter callback={this.setFilter.bind(this)}/>}
                                        buttonText={"Show Filters"}/>
                    </div>
                </div>

                {this.state.data !== undefined &&
                    <div className="content">
                        <LeafletMapAdapter map={this.state.data} categories={this.state.filter}/>
                    </div>}
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