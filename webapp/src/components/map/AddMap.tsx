import React from "react";
import Map from "../../domain/Map";
import {Button, TextField} from "@mui/material";
import Group from "../../domain/Group";
import LoadingPage from "../basic/LoadingPage";
import PODManager from "../../adapters/solid/PODManager";
import "../../styles/AddMap.css"
import { error } from "console";

export default class AddMap extends React.Component<{ group: Group }, {
    mapTitle: string,
    mapDescription: string,
    isCreationDone: boolean,
    hasLoaded: boolean,
    titleError: string,
    descriptionError: string
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            mapTitle: "New map",
            mapDescription: "",
            isCreationDone: false,
            hasLoaded: true,
            titleError: "",
            descriptionError: ""
        }
        this.createMapForGroup = this.createMapForGroup.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }

    private createMapForGroup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let erorrs = false;
        if (this.state.mapTitle.trim().length === 0 || this.state.mapTitle === "New map") {
            this.setState(({
                titleError: "The map title can not be empty or 'NewMap'"
            }));
            erorrs = true;
        } 
        if (this.state.mapDescription.trim().length === 0) {
            this.setState(({
                descriptionError: "The map description can not be empty"
            }));
            erorrs = true;
        } 

        if (erorrs) {
            return;
        }

        this.setState(({
            hasLoaded: false
        }));
        const map: Map = new Map(this.state.mapTitle, this.state.mapDescription);
        let pod = new PODManager();
        pod.addMapToGroup(map, this.props.group).then(() => {
            this.setState(({
                isCreationDone: true
            }));
        });
        
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
            return <div><LoadingPage/></div>
        }

        return (
        <div >
            <form onSubmit={this.createMapForGroup}>
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
                {this.state.titleError && <span className="error">{this.state.titleError}</span>}
                <h2>Description:</h2>
                <TextField
                    id="standard-basic"
                    name="map-description"
                    label="Map description"
                    variant="standard"
                    sx={{marginBottom: "1em"}}
                    onChange={this.handleDescriptionChange}
                />
                {this.state.descriptionError && <span className="error">{this.state.descriptionError}</span>}
                <Button
                    sx={{marginTop: "1em", alignSelf: "end", height: "2em"}} size={"small"}
                    type={"submit"} variant={"contained"} color={"primary"}>Create</Button>
            </form>
        </div>);
    }
}