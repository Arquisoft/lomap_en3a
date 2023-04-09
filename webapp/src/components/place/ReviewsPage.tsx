import React from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import "./../../styles/pointInfo.css";

interface ReviewsPageState {

}

export default class ReviewsPage extends React.Component<IPlacePageProps, ReviewsPageState> {

    private averageRating: number;
    // Notes, it would be convenient for this component to recieve a structure like this
    // containing the link to the user and the comment as a string, as in this way comments
    // would be more usefull and representative
    private comments: Array<{ user: string, comment: String }>;

    constructor(props: IPlacePageProps) {
        super(props);
        // TODO Testing puroposes only
        this.averageRating = 3.5;
        this.comments = new Array<{ user: string; comment: String }>();
        this.comments.push({user: "Guille", comment: "Nice place!"});
        this.comments.push({user: "Pelayo", comment: "I dont like it"});
        this.comments.push({user: "Carlos", comment: "I was here"});
        this.comments.push({user: "Ivan", comment: "I was here too"});
        this.comments.push({user: "Ivan", comment: "I was here too"});
    }

    render() {
        return <div className="ReviewsPage">
            <h3>Average Rating</h3>
            <div>
                <Rating readonly initialValue={4}></Rating>
            </div>
            <h3>Comments</h3>
            <div id="commentsContainer">
                <div id="comments">
                    {this.comments.map((comment) => (
                        <section><a>{comment.user}</a>
                            <p>{comment.comment}</p></section>
                    ))}
                </div>
            </div>
        </div>;
    }
}