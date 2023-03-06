import React from "react";
import {getSolidDataset, SolidDataset } from "@inrupt/solid-client";
export default class PointInformation extends React.Component{

    private url : string;

    public constructor(props: any, url : string) {
        super(props);
        this.url = url;
    }

    private async initialize() {
        var data = await getSolidDataset(this.url);
        if (data != null) {
            var graphs = data.graphs;
            var internalResourceInfo = data.internal_resourceInfo;
            console.log(data);
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <h1>Name: {}</h1>
                <h2>Location: {}</h2>
                <div id="images">
                    <img src={"..."}/>
                </div>
                <h3>Description</h3>
                <p>{"..."}</p>
            </div>
        );
    }

}