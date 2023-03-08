import React from "react";
import {getSolidDataset, SolidDataset } from "@inrupt/solid-client";
import MapPoint from "../domain/MapPoint";
import ImageList from "../components/ImageList";
export default class PointInformation extends React.Component{

    // For non laoded points
    private url : string;
    // Already loaded points
    private point : MapPoint;

    public constructor(props: any, url : string, point : MapPoint) {
        super(props);
        this.url = url;
        this.point = point;
    }

    /**
     * Will be used when we introduce the PODs information
     * @private
     */
    private async initialize() {
        var data = await getSolidDataset(this.url);
        if (data != null) {
            var graphs = data.graphs;
            var internalResourceInfo = data.internal_resourceInfo;
            console.log(data);
        }
    }

    public render(): JSX.Element {
        if(this.point != null) {
            return (
                <div>
                    <h1>Title: {this.point.title}</h1>
                    <h2>Location: {this.point.location}</h2>
                    <div id="images">
                        <ImageList images={this.point.images}></ImageList>
                    </div>
                    <h3>Description</h3>
                    <p>{this.point.description}</p>
                </div>
            );
        }else{ // TODO
            return (
                <>
                </>
            );
        }
    }

}