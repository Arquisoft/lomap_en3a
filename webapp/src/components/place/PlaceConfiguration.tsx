import React from "react";
import PrivacyComponent from "./PrivacyComponent";
import User from "../../domain/User";
import Group from "../../domain/Group";
import Placemark from "../../domain/Placemark";
import PODManager from "../../adapters/solid/PODManager";
import Place from "../../domain/Place";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";

export default class PlaceConfiguration extends React.Component<{
    placemark: Placemark,
    pod: PODManager,
    point: Place
}, {
    friends: User[], visibility: string, openModal: boolean
}> {

    constructor(props: { placemark: Placemark, pod: PODManager, point: Place }) {
        super(props);
        this.state = {
            friends: [],
            visibility: "",
            openModal: false
        }
        this.savePlaceVisibility = this.savePlaceVisibility.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    //Callback function to pass it to the PrivacyComponent
    //It updates the privacy of the place
    private handleVisibilityChange = (privacy: string, friends: User[]) => {
        this.setState({visibility: privacy, friends: friends});
    }

    private savePlaceVisibility() {
        let placeUrl = this.props.placemark.getPlaceUrl();

        switch (this.state.visibility) {
            case "public":
                this.props.pod.changePlacePublicAccess(this.props.point, true);
                break;
            case "private":
                this.props.pod.changePlacePublicAccess(this.props.point, false);
                break;
        }

        if (this.state.friends.length > 0) {
            let group = new Group("", this.state.friends);
            this.props.pod.setGroupAccess(placeUrl, group, {read: true});
        }

        this.setState(({
            openModal: true
        }));
    }

    render() {
        return (<div id="visibility">
            <h3>Change visibility of the place:</h3>
            <PrivacyComponent updatePrivacy={this.handleVisibilityChange}/>
            <input type="button" id="confirm" value="Confirm change" onClick={this.savePlaceVisibility}/>
            <Modal open={this.state.openModal} onClose={() => {
                this.setState({openModal: false})
            }} style={{height: "15em", width: "10em", position: "absolute", left: "45%", top: "35%"}}>
                <ModalDialog className="custom-modal-dialog">
                    <ModalClose/>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <h2>Done!</h2>
                        <CheckCircleSharpIcon color={"success"} sx={{fontSize: "4em", marginLeft: "40%"}}/>
                    </div>
                </ModalDialog>
            </Modal>
        </div>)
    }

}