import React from "react";
import Map from "../../domain/Map";
import {Button, TextField} from "@mui/material";
import Group from "../../domain/Group";
import LoadingPage from "../basic/LoadingPage";
import PODManager from "../../adapters/solid/PODManager";

export default class AddMap extends React.Component<{ group: Group }, {
    mapTitle: string,
    error: string | null,
    description: string,
    isCreationDone: boolean
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            mapTitle: "New map",
            error: null,
            description: "",
            isCreationDone: true
        }
    }

    private createMapForGroup(event: React.FormEvent<HTMLFormElement>) {
        if (this.state.mapTitle.trim().length === 0) {
            this.setState(({
                error: "The map title can not be empty"
            }));
        } else if (this.state.description.trim().length === 0) {
            this.setState(({
                error: "The map description can not be empty"
            }));
        } else {
            const map: Map = new Map(this.state.mapTitle, this.state.description);
            new PODManager().addMapToGroup(map, this.props.group).then(() => {
                this.setState(({
                    isCreationDone: true
                }));
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
            description: value
        }));
    }

    render() {
        if (this.state.isCreationDone) {
            return <div>
                <h2>Done!</h2>
            </div>
        }

        return (<div style={{overflow: "scroll"}}>
            <form onSubmit={this.createMapForGroup}>
                <span><p>{this.state.error}</p></span>
                <h1>{this.state.mapTitle}</h1>
                <TextField
                    id="standard-basic"
                    name="group-name"
                    label="Group name"
                    variant="standard"
                    sx={{marginBottom: "1em"}}
                    onChange={this.handleInputChange}
                />
                <TextField
                    id="standard-basic"
                    name="group-name"
                    label="Group name"
                    variant="outlined"
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