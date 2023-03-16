import React from "react";
import Place from "../domain/Place";
import ImageList from "../components/ImageList";
import { Link } from "react-router-dom";
import "../styles/pointInfo.css";
import Map from "../domain/Map";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";

interface PointInformationProps{
    point : Place;
    map : Map;
}

interface PointInformationState {
    goBack: boolean;
}

export default class PointInformation extends React.Component<PointInformationProps, PointInformationState> {

    private point: Place;

    public constructor(props: any) {
        super(props);
        this.point = props.point;
        this.state = {goBack: false};
    }

    private goBack() {
        this.setState({goBack:true});
	}

    /**
     * Returns the point information view, the ImageList returns a Slider
     * with the given images and the Link is just a button to go back to
     * the home page.
     * @author UO283069
     */
    public render(): JSX.Element {
        if (this.state.goBack) {
            return <LeafletMapAdapter map={this.props.map} />;
        }
        return (
            <section>
                <div className="pointInformation">
                    <h1>Title: {this.point.title}</h1>
                    <div id="images">
                        <ImageList images={this.point.photos}></ImageList>
                    </div>
                    <p>Location: {this.point.latitude + ", " + this.point.longitude}</p>
                    <h2>Description</h2>
                    <p>{this.point.description}</p>
                </div>
                <input type="button" value="Back" onClick={this.goBack.bind(this)} />
            </section>
        );
    }

}