import React from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import "./../../styles/pointInfo.css";
import PODManager from "../../adapters/solid/PODManager";
import PlaceComment from "../../domain/place/PlaceComment";
import LoadingPage from "../basic/LoadingPage";

interface ListReviewsState {
    comments: PlaceComment[];
    loading: boolean;
}

interface ListReviewsProps extends IPlacePageProps {
    pod: PODManager;
}

export default class ListReviews extends React.Component<ListReviewsProps, ListReviewsState> {

    constructor(props: ListReviewsProps) {
        super(props);
        this.state = {
            comments: [],
            loading: true,
        }
    }

    public async componentDidMount(): Promise<void> {
        await this.getComments((comments) => this.setState({comments: comments, loading: false}));

    }

    public async getComments(callback: (comments: any) => void) {
        let comments = await this.props.pod.getComments(this.props.placeUrl as string);
        callback(comments);
    }

    render() {
        return <div className="ReviewsPage">
            {this.state.loading && <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>}
            {!this.state.loading && <div id="commentsContainer">
                <div id="comments">
                    {this.state.comments.length <= 0 && <p>No comments yet</p>}
                    {this.state.comments.length > 0 &&
                        this.state.comments.map((comment) => (
                            <section>
                                <a href={comment.user}>{comment.user.replace("https://", "").split(".")[0]}</a>
                                <p>{comment.comment}</p>
                            </section>
                        ))
                    }
                </div>
            </div>}
        </div>;
    }
}