import React from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import "./../../styles/pointInfo.css";
import PODManager from "../../adapters/solid/PODManager";
import PlaceComment from "../../domain/Place/PlaceComment";
import LoadingPage from "../basic/LoadingPage";

interface ReviewsPageState {
    comments: PlaceComment[];
    score: number;
    loading: boolean;
}

export default class ReviewsPage extends React.Component<IPlacePageProps, ReviewsPageState> {

    // Notes, it would be convenient for this component to recieve a structure like this
    // containing the link to the user and the comment as a string, as in this way comments
    // would be more usefull and representative
    private pod = new PODManager();

    constructor(props: IPlacePageProps) {
        super(props);
        // TODO Testing puroposes only
        this.state = {
            comments: [],
            loading: true,
            score: 0
        }
    }

    public async componentDidMount(): Promise<void> {
        this.setState({comments: [], loading:true})
        let comments = await this.pod.getComments(this.props.placeUrl as string);
        let score = (await this.pod.getScore(this.props.placeUrl as string)).score;
        this.setState({comments: comments, score:score, loading:false})
    }

    render() {
        return <div className="ReviewsPage">
            <h3>Average Rating</h3>
            <div>
                <Rating readonly initialValue={this.state.score}></Rating>
            </div>
            <h3>Comments</h3>
            {this.state.loading && <LoadingPage />}
            {!this.state.loading && <div id="commentsContainer">
                <div id="comments">
                    {this.state.comments.length <= 0 && <p>No comments yet</p>}
                    {this.state.comments.length > 0 && 
                        this.state.comments.map((comment) => (
                            <section>
                                <a href={comment.user}>{comment.user.replace("https://","").split(".")[0]}</a>
                                <p>{comment.comment}</p>
                            </section>
                        ))
                    }
                </div>
            </div>}
        </div>;
    }
}