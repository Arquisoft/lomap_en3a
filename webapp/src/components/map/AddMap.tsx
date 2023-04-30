import React from "react";
import Map from "../../domain/Map";
import {Button, TextField} from "@mui/material";
import Group from "../../domain/Group";
import LoadingPage from "../basic/LoadingPage";
import PODManager from "../../adapters/solid/PODManager";

export default class AddMap extends React.Component<{ group: Group }, {
    mapTitle: string,
    error: string | null,
    mapDescription: string,
    isCreationDone: boolean,
    hasLoaded: boolean
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            mapTitle: "New map",
            error: null,
            mapDescription: "",
            isCreationDone: false,
            hasLoaded: true
        }
        this.createMapForGroup = this.createMapForGroup.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }

    private createMapForGroup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (this.state.mapTitle.trim().length === 0) {
            this.setState(({
                error: "The map title can not be empty"
            }));
        } else if (this.state.mapDescription.trim().length === 0) {
            this.setState(({
                error: "The map description can not be empty"
            }));
        } else {
            this.setState(({
                hasLoaded: false
            }));
            const map: Map = new Map(this.state.mapTitle, this.state.mapDescription);
            let pod = new PODManager();
            pod.saveMap(map).then(() => {
                pod.addMapToGroup(map, this.props.group).then(() => {
                    this.setState(({
                        isCreationDone: true
                    }));
                });
            });
        }
    }

    private handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;

        this.setState(({
            mapTitle: value
        }));
    }

    private handleDescriptionChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;

        this.setState(({
            mapDescription: value
        }));
    }

    render() {
        if (this.state.isCreationDone) {
            return <div>
                <h2>Done!</h2>
            </div>
        }

        if (!this.state.hasLoaded) {
            return <LoadingPage/>
        }

        return (
        <div >
            <form onSubmit={this.createMapForGroup}>
                <span><p>{this.state.error}</p></span>
                <h1>{this.state.mapTitle}</h1>
                <h2>Title of the map:</h2>
                <TextField
                    id="standard-basic"
                    name="map-name"
                    label="Map name"
                    variant="standard"
                    sx={{marginBottom: "1em"}}
                    onChange={this.handleInputChange}
                />

                <h2>Description:</h2>
                <TextField
                    id="standard-basic"
                    name="map-description"
                    label="Map description"
                    variant="standard"
                    sx={{marginBottom: "1em"}}
                    onChange={this.handleDescriptionChange}
                />
                <Button
                    sx={{marginTop: "1em", alignSelf: "end", height: "2em"}} size={"small"}
                    type={"submit"} variant={"contained"} color={"primary"}>Create</Button>
            </form>
        </div>);
    }
}