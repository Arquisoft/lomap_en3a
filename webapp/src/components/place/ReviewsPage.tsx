import React from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import "./../../styles/pointInfo.css";
import PODManager from "../../adapters/solid/PODManager";
import PlaceComment from "../../domain/Place/PlaceComment";

interface ReviewsPageState {
    comments: PlaceComment[];
    loading: boolean;
}

export default class ReviewsPage extends React.Component<IPlacePageProps, ReviewsPageState> {

    private averageRating: number;
    // Notes, it would be convenient for this component to recieve a structure like this
    // containing the link to the user and the comment as a string, as in this way comments
    // would be more usefull and representative
    private pod = new PODManager();

    constructor(props: IPlacePageProps) {
        super(props);
        // TODO Testing puroposes only
        this.averageRating = 3.5;
        this.state = {
            comments: [],
            loading: true
        }
    }

    public async componentDidMount(): Promise<void> {
        this.setState({comments: [], loading:true})
        let comments = await this.pod.getComments(this.props.placeUrl as string);
        this.setState({comments: comments, loading:false})
    }

    render() {
        return <div className="ReviewsPage">
            <h3>Average Rating</h3>
            <div>
                <Rating readonly initialValue={4}></Rating>
            </div>
            <h3>Comments</h3>
            <div id="commentsContainer">
                {this.state.loading && <p>Loading...</p>}
                {!this.state.loading && <div id="comments">
                    {this.state.comments.map((comment) => (
                        <section>
                            <a>{comment.user}</a>
                            <p>{comment.comment}</p>
                        </section>
                    ))}
                </div>}
            </div>
        </div>;
    }
}