import React from "react";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import Map from "../domain/Map";
import PODManager from "../adapters/solid/PODManager";
import { ChangeEvent } from "react";

export default class Home extends React.Component<{},{data:Map|undefined}> {
    private podManager = new PODManager();
    private webID: string;
    private maps: Array<Map>;

    public constructor(props: any) {
        super(props);
        this.webID = SolidSessionManager.getManager().getWebID();
        this.maps = new Array();
        this.state = {
            data: undefined
        };
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
            </section>
        );
    }
}