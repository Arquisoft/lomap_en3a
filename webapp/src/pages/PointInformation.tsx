import React from "react";
import Place from "../domain/Place";
import ImageList from "../components/ImageList";
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

interface PointInformationProps {
    placemark: Placemark;
    map: Map;
    open: boolean;
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
        console.log(this.state.open);
        this.goBack = this.goBack.bind(this);
        this.handleClickReview = this.handleClickReview.bind(this);
        this.handleClickOverview = this.handleClickOverview.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        this.point = await this.pod.getPlace(this.props.placemark.getPlaceUrl());
        this.setState({
            component: <OverviewPage place={this.point}/>
        });
    }


    private goBack() {
        this.setState({goBack: true});
    }

    private handleClickReview() {
        this.setState({component: <ReviewsPage place={this.point} placeUrl={this.props.placemark.getPlaceUrl()}/>});

    };

    private handleClickOverview() {
        this.setState({component: <OverviewPage place={this.point}/>});
    }

	//Callback function to pass it to the PrivacyComponent
	//It updates the privacy of the place
	handleVisibilityChange = (privacy: string, friends: User[]) => {
		this.setState({ visibility: privacy });
		this.setState({ friends: friends });
	}
    /**
     * Returns the point information view, the ImageList returns a Slider
     * with the given images and the Link is just a button to go back to
     * the home page.
     */
    public render(): JSX.Element {
        if (this.state.goBack) {
            return <LeafletMapAdapter map={this.props.map}/>;
        }
        return (
            <Modal open={this.state.open} onClose={() => {
                this.setState(({open: false}));
                this.goBack();
            }}>
                <ModalDialog className="custom-modal-dialog">
                    <ModalClose/>
                    <section className="pointInfo" /*style={{overflow: "scroll"}}*/>
                        <div className="pointInformation">
                            <h1>Title: {this.point.title}</h1>
                            <div id="images">
                                <ImageList images={this.point.photos}></ImageList>
                            </div>
                            <p>Location: {this.point.latitude != 0 ? this.point.latitude + ", " + this.point.longitude : "Loading..."}</p>

                            {this.props.placemark.isOwner(this.sessionManager.getWebID()) &&
                                <div id="visibility">
                                <h3>Select visibility of the place</h3>
                                    <PrivacyComponent updatePrivacy={this.handleVisibilityChange}/>
                            </div>}
                        </div>
                        <div>


                            <button
                                id={this.state.component.type === OverviewPage ? 'selected' : 'unselected'
                                } onClick={this.handleClickOverview}>Overview
                            </button>

                            <button
                                id={this.state.component.type === ReviewsPage ? 'selected' : 'unselected'
                                } onClick={this.handleClickReview}>Reviews
                            </button>

                            {this.state.component}
                        </div>
                        <input type="button" id="back" value="Back" onClick={this.goBack}/>
                    </section>
                </ModalDialog>
            </Modal>
        );
    }

}