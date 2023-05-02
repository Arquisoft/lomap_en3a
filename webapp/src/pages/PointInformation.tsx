import React, {ReactElement} from "react";
import Place from "../domain/Place";
import ImageList from "../components/basic/ImageList";
import "../styles/pointInfo.css";
import Map from "../domain/Map";
import LeafletMapAdapter from "../adapters/map/LeafletMapAdapter";
import ReviewsPage from "../components/place/ReviewsPage";
import OverviewPage from "../components/place/OverviewPage";
import Placemark from "../domain/Placemark";
import PODManager from "../adapters/solid/PODManager";
import LoadingPage from "../components/basic/LoadingPage";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import PrivacyComponent from "../components/place/PrivacyComponent";
import FriendManager from "../adapters/solid/FriendManager";
import User from "../domain/User";
import Group from "../domain/Group";

interface PointInformationProps {
    placemark: Placemark;
    map?: Map;
    open: boolean;
    prevComponent?: JSX.Element;
    onBack?: (prevComponent: ReactElement) => void;
}

interface PointInformationState {
    goBack: boolean;
    component: JSX.Element;
    visibility: string;
    open: boolean;
    friends: User[];
    friendsList: User[];
}

export default class PointInformation extends React.Component<PointInformationProps, PointInformationState> {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();
    private point: Place;
    private pod = new PODManager();
    private photosURLs: string[] = [];

    public constructor(props: any) {
        super(props);
        this.point = new Place("Loading...", 0, 0, "", undefined, undefined, "");

        this.state = {
            goBack: false,
            component: <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>,
            visibility: "",
            open: this.props.open,
            friends: [],
            friendsList: [],
        };
        this.goBack = this.goBack.bind(this);
        this.handleClickReview = this.handleClickReview.bind(this);
        this.handleClickOverview = this.handleClickOverview.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.savePlaceVisibility = this.savePlaceVisibility.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        this.point = await this.pod.getPlace(this.props.placemark.getPlaceUrl());
        this.photosURLs = await this.pod.getImageUrls(this.props.placemark.getPlaceUrl());
        this.setState({
            component: <OverviewPage place={this.point} placeUrl={this.props.placemark.getPlaceUrl()}/>
        });
    }


    private goBack() {
        this.setState({goBack: true});
    }

    private savePlaceVisibility() {
        let placeUrl = this.props.placemark.getPlaceUrl();

        switch (this.state.visibility) {
            case "public":
                this.pod.setPublicAccess(placeUrl, true);
                break;
            case "private":
                this.pod.setPublicAccess(placeUrl, false);
                break;
        }

        if (this.state.friends.length > 0) {
            let group = new Group("", this.state.friends);
            this.pod.setGroupAccess(placeUrl, group, {read: true});
        }
    }

    private handleClickReview() {
        this.setState({component: <ReviewsPage place={this.point} placeUrl={this.props.placemark.getPlaceUrl()}/>});

    };

    private handleClickOverview() {
        console.log(this.props.placemark.getPlaceUrl())
        this.setState({component: <OverviewPage place={this.point} placeUrl={this.props.placemark.getPlaceUrl()}/>});
    }

    //Callback function to pass it to the PrivacyComponent
    //It updates the privacy of the place
    handleVisibilityChange = (privacy: string, friends: User[]) => {
        this.setState({visibility: privacy, friends: friends});
    }

    /**
     * Returns the point information view, the ImageList returns a Slider
     * with the given images and the Link is just a button to go back to
     * the home page.
     */
    public render(): JSX.Element {
        if (this.state.goBack) {
            //return <LeafletMapAdapter map={this.props.map}/>;
            return this.props.prevComponent ?? <LeafletMapAdapter map={this.props.map}/>;
        }
        return (
            <Modal open={this.state.open} onClose={() => {
                this.savePlaceVisibility();
                this.setState(({open: false}));
                if (this.props.onBack !== undefined) {
                    this.props.onBack(this.props.prevComponent ?? <LeafletMapAdapter map={this.props.map}/>);
                }
            }}>
                <ModalDialog className="custom-modal-dialog">
                    <ModalClose />
                    <section className="pointInfo" /*style={{overflow: "scroll"}}*/>
                        <div className="pointInformation">
                            {this.point.title === "Loading..." &&
                                <h1>Title: {this.point.title}</h1>}
                            {this.point.title !== "Loading..." &&
                                <h1>{this.point.title}</h1>}
                            <div id="images">
                                <ImageList images={this.photosURLs}></ImageList>
                            </div>
                            <p>Location: {this.point.latitude != 0 ? this.point.latitude + ", " + this.point.longitude : "Loading..."}</p>

                            {this.props.placemark.isOwner(this.sessionManager.getWebID()) &&
                                <div id="visibility">
                                    <h3>Change visibility of the place:</h3>
                                    <PrivacyComponent updatePrivacy={this.handleVisibilityChange}/>
                                </div>}
                        </div>
                        <div>
                            <button
                                className={`pi-radio-option ${this.state.component.type === OverviewPage ? "selected" : "unselected"
                                }`} onClick={this.handleClickOverview}>Overview
                            </button>

                            <button
                                className={`pi-radio-option ${this.state.component.type === ReviewsPage ? "selected" : ""
                                }`} onClick={this.handleClickReview}>Reviews
                            </button>
                            {this.state.component}
                        </div>
                    </section>
                </ModalDialog>
            </Modal>
        );
    }

}