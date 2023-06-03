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
import User from "../domain/User";
import Group from "../domain/Group";
import PlaceConfiguration from "../components/place/PlaceConfiguration";

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
            open: this.props.open,
            friends: [],
            friendsList: [],
        };
        this.goBack = this.goBack.bind(this);
        this.handleClickReview = this.handleClickReview.bind(this);
        this.handleClickOverview = this.handleClickOverview.bind(this);
        this.handleClickConfiguration = this.handleClickConfiguration.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        this.point = await this.pod.getPlace(this.props.placemark.getPlaceUrl());
        this.photosURLs = await this.pod.getImageUrls(this.props.placemark.getPlaceUrl());
        this.point.category = this.props.placemark.getCategory();
        this.setState({
            component: <OverviewPage place={this.point} placeUrl={this.props.placemark.getPlaceUrl()}/>
        });
    }

    private goBack() {
        this.setState({goBack: true});
    }

    private handleClickReview() {
        this.setState({component: <ReviewsPage place={this.point} placeUrl={this.props.placemark.getPlaceUrl()}/>});

    };

    private handleClickOverview() {
        this.setState({component: <OverviewPage place={this.point} placeUrl={this.props.placemark.getPlaceUrl()}/>});
    }

    private handleClickConfiguration() {
        this.setState({
            component: <PlaceConfiguration placemark={this.props.placemark} pod={this.pod}
                                           point={this.point}/>
        });
    }

    /**
     * Returns the point information view, the ImageList returns a Slider
     * with the given images and the Link is just a button to go back to
     * the home page.
     */
    public render(): JSX.Element {
        if (this.state.goBack) {
            return this.props.prevComponent ?? <LeafletMapAdapter map={this.props.map}/>;
        }
        return (
            <Modal open={this.state.open} onClose={() => {
                this.setState(({open: false}));
                if (this.props.onBack !== undefined) {
                    this.props.onBack(this.props.prevComponent ?? <LeafletMapAdapter map={this.props.map}/>);
                }
            }}>
                <ModalDialog className="custom-modal-dialog">
                    <ModalClose/>
                    <section className="pointInfo" /*style={{overflow: "scroll"}}*/>
                        <div className="pointInformation">
                            {this.point.title === "Loading..." ? <h1>Loading...</h1> :
                                <h1>{this.point.title}</h1>}
                            {this.point.title != "Loading..." &&
                                <p style={{fontSize: "small"}}>Place submitted by <a
                                    href={"https://" + this.props.placemark.getOwner()}>{this.props.placemark.getOwner().split(".")[0]}</a>
                                </p>}
                            <div id="images">
                                <ImageList images={this.photosURLs}></ImageList>
                            </div>
                            <p>Location: {this.point.longitude !== 0 ? this.point.longitude + ", " + this.point.latitude : "Loading..."}</p>
                            <div>
                                <button
                                    className={`pi-radio-option ${this.state.component.type === OverviewPage ? "selected" : "unselected"
                                    }`} onClick={this.handleClickOverview}>Overview
                                </button>

                                <button
                                    className={`pi-radio-option ${this.state.component.type === ReviewsPage ? "selected" : ""
                                    }`} onClick={this.handleClickReview}>Reviews
                                </button>
                                {this.props.placemark.isOwner(this.sessionManager.getWebID()) &&
                                    <button
                                        className={`pi-radio-option ${this.state.component.type === PlaceConfiguration ? "selected" : ""
                                        }`} onClick={this.handleClickConfiguration}>Configuration
                                    </button>
                                }
                                {this.state.component}
                            </div>
                        </div>
                    </section>
                </ModalDialog>
            </Modal>
        );
    }

}