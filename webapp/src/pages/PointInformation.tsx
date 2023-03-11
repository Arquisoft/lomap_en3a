import React from "react";
import MapPoint from "../domain/MapPoint";
import ImageList from "../components/ImageList";
import { Link } from "react-router-dom";

export default class PointInformation extends React.Component {

    // Already loaded points
    private point: MapPoint;

    public constructor(props: any, point: MapPoint) {
        super(props);
        this.point = point;
    }

    /**
     * Will be used when we introduce the PODs information
     * @private
     */
    /**
     private async initialize() {
        var data = await getSolidDataset(this.url);
        if (data != null) {
            var graphs = data.graphs;
            var internalResourceInfo = data.internal_resourceInfo;
            console.log(data);
        }
    }
     **/

    /**
     * Returns the point information view, the ImageList returns a Slider
     * with the given images and the Link is just a button to go back to
     * the last page we where in.
     */
    public render(): JSX.Element {
        return (
            <section>
                <div>
                    <h1>Title: {this.point.title}</h1>
                    <h2>Location: {this.point.location}</h2>
                    <div id="images">
                        <ImageList images={this.point.images}></ImageList>
                    </div>
                    <h3>Description</h3>
                    <p>{this.point.description}</p>
                </div>
                <Link to={"/?"} role="button" className="backButton">Back</Link>
            </section>
        );
    }

}