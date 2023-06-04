import React from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import "./../../styles/pointInfo.css";
import PODManager from "../../adapters/solid/PODManager";
import LoadingPage from "../basic/LoadingPage";
import ListReviews from "./ListReviews";
import AddReview from "./AddReview";

interface ReviewsPageState {
    score: number;
    loadingRating: boolean;
    updatedReviewsList: JSX.Element;
}

export default class ReviewsPage extends React.Component<IPlacePageProps, ReviewsPageState> {
    private listReviewsRef: React.RefObject<ListReviews>;
    private pod = new PODManager();

    constructor(props: IPlacePageProps) {
        super(props);
        this.listReviewsRef = React.createRef();
        this.state = {
            score: 0,
            loadingRating: true,
            updatedReviewsList: (<ListReviews ref={this.listReviewsRef} pod={this.pod} place={this.props.place} placeUrl={this.props.placeUrl}/>)
        }
        this.updateReviewsList = this.updateReviewsList.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        await this.getScore((score) => this.setState({score: score, loadingRating: false}));
    }

    public async getScore(callback: (rating: any) => void) {
        let score = (await this.pod.getScore(this.props.placeUrl as string)).score;
        callback(score);
    }

    /**
     * With this method I am trying to update the current reviews list  to the new one with
     * the comment that the user just uploaded
     * BUT IT DOES NOT WORK
     */
    public updateReviewsList() {
            console.log("Updated reviews list");
            if (this.listReviewsRef.current) {
                this.listReviewsRef.current.updateReviews();
            }
            console.log("Updated reviews list");

    }

    render() {
        return <div className="ReviewsPage">
            <h3>Average Rating</h3>
            <div>
                {this.state.loadingRating && <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>}
                {!this.state.loadingRating && <Rating readonly initialValue={this.state.score}></Rating>}
            </div>
            <h3>Comments</h3>
            {this.state.updatedReviewsList}
            <AddReview pod={this.pod} place={this.props.place} placeUrl={this.props.placeUrl}
                       callback={() => this.updateReviewsList()}/>
        </div>;
    }
}