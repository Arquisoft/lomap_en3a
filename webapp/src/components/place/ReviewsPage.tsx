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

    private pod = new PODManager();

    constructor(props: IPlacePageProps) {
        super(props);
        this.state = {
            score: 0,
            loadingRating: true,
            updatedReviewsList: (<ListReviews pod={this.pod} place={this.props.place} placeUrl={this.props.placeUrl}/>)
        }
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
        this.setState(({
            updatedReviewsList: <ListReviews pod={this.pod} place={this.props.place} placeUrl={this.props.placeUrl}/>
        }));
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
                       callback={this.updateReviewsList}/>
        </div>;
    }
}