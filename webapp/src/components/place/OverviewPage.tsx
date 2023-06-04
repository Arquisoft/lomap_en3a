import React, {ChangeEvent} from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import IPlacePageState from "./IPlacePage";
import "../../styles/OverviewPage.css"; // Import the CSS file
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
import PlaceComment from "../../domain/place/PlaceComment";
import PlaceRating from "../../domain/place/PlaceRating";
import {PhotoPreview} from "./AddPlace";
import PODManager from "../../adapters/solid/PODManager";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import {Chip} from "@mui/material";
import {PlaceCategory} from "../../domain/place/PlaceCategory";
import WeatherPage from "./WeatherPage";

export default class OverviewPage extends React.Component<IPlacePageProps, IPlacePageState> {

    private categoryColors = ["#8C0000", "#002D65", "#006800", "#000000", "#8728B4", "#963F00"]

    public constructor(props: IPlacePageProps) {
        super(props);
        this.state = {
            place: props.place,
            placeUrl: props.placeUrl
        }
    }

    private getColorFor(category: string) {
        let pos = Object.keys(PlaceCategory).indexOf(category) + 1;
        if (pos % 2 === 0) {
            pos = pos / 2 - 1;
        } else {
            pos = (pos - 1) / 2;
        }

        return this.categoryColors[pos];
    }

    render() {
        return (
            <div className="OverviewPage">
                <div>
                    {this.state.place.category != "" &&
                        <Chip label={this.state.place.category.toUpperCase()}
                              sx={{backgroundColor: this.getColorFor(this.state.place.category), color: "white"}}/>}
                    <p>{this.state.place.description}</p>
                </div>
                <WeatherPage place={this.state.place}/>
            </div>
        );
    }
}