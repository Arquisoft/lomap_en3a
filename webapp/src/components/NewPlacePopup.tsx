import React from "react";
import {Button} from "@mui/material";

interface NewPlacePopupProps {
    new: (e: React.MouseEvent) => void;
    cancel: (e: React.MouseEvent) => void;
}

export default class NewPlacePopup extends React.Component<NewPlacePopupProps> {
    public constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <form style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
                <Button type="button" value="New" onClick={this.props.new} style={{color: "black"}}>New</Button>
                <Button type="button" value="Cancel" onClick={this.props.cancel} color={"error"}>Cancel</Button>
            </form>
        );
    }
}