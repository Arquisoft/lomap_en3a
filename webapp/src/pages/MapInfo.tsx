import React from "react";
import "../styles/pointInfo.css";
import Map from "../domain/Map";
import PODManager from "../adapters/solid/PODManager";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";

interface MapInfoProps {
    map: Map;
}

interface MapInfoState {
    goBack: boolean;
    visibility: string;
}

export default class MapInfo extends React.Component<MapInfoProps, MapInfoState> {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();
    private pod = new PODManager();

    public constructor(props: any) {
        super(props);
        this.state = {
            goBack: false,
            visibility: ""
        };
        this.goBack = this.goBack.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    private goBack() {
        this.setState({goBack: true});
    }

    private handleVisibilityChange(event: React.ChangeEvent<HTMLSelectElement>) {
        switch (event.target.value) {
            case "public":
                this.setState({visibility: event.target.value});
                this.pod.setPublicAccess(this.props.map.getId(), true);
                break;
            case "private":
                this.setState({visibility: event.target.value});
                this.pod.setPublicAccess(this.props.map.getId(), false);
                break;
            case "friends":
                this.setState({visibility: event.target.value});
                //this.pod.setPublicAccess(this.props.placemark.getPlaceUrl(), event.target.value);
                break;
        }
    }

    /**
     * Returns the map information view
     */
    public render() {
        return (
            <section style={{overflow: "scroll"}}>
                <div className="mapInformation">
                    <h1>Title: {this.props.map.getName()}</h1>
                    <h2>Description: {this.props.map.getDescription()}</h2>
                    {/*{this.props.map.isOwner(this.sessionManager.getWebID()) &&*/}
                    <div>
                        <h3>Change the visibility of the map</h3>
                        <select title="visibility" name="visibility" id="visibility"
                                value={this.state.visibility} onChange={this.handleVisibilityChange}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends">Friends</option>
                        </select>
                    </div>
                </div>
                <input type="button" id="back" value="Back" onClick={this.goBack}/>
            </section>
        );
    }

}