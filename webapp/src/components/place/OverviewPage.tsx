import React from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import IPlacePageState from "./IPlacePage";
import "../../styles/OverviewPage.css"; // Import the CSS file
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
import PlaceComment from "../../domain/Place/PlaceComment";
import PlaceRating from "../../domain/Place/PlaceRating";

interface OverviewPageState extends IPlacePageState {
    comment: string;
    rating: number;
}

export default class OverviewPage extends React.Component<IPlacePageProps, OverviewPageState> {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();
    private rate = Rating;

    public constructor(props : IPlacePageProps) {
        super(props);
        this.state = {
            place: props.place,
            comment: "",
            rating: 0
        }
        //Binding
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputRatingChange = this.handleInputRatingChange.bind(this);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		} as unknown as Pick<OverviewPageState, keyof IPlacePageProps>);
    }

    handleInputRatingChange = (rate : number) => {
		this.setState({
			rating: rate,
		} as unknown as Pick<OverviewPageState, keyof IPlacePageProps>);
    }

    handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        var comment = new PlaceComment(this.state.place, this.sessionManager.getWebID(), this.state.comment);
        //Here the persistence of the object

        console.log("Form submitted, comment:", comment);
    };
    
    handleSubmitRating = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        var rating = new PlaceRating(this.state.place, this.sessionManager.getWebID(), this.state.rating);
        //Here the persistence of the object

        console.log("Form submitted, rating:", rating);
    };

    render() {    
        return (
          <div className="OverviewPage">
            <div>
                <h1>{this.state.place.description}</h1>
            </div>
            <form onSubmit={this.handleSubmitComment}>
                <label htmlFor="comment">Comment:</label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={this.state.comment}
                        onChange={this.handleInputChange}
                        required
                    />
                <button type="submit">Publish</button>
            </form>

            <form onSubmit={this.handleSubmitRating}>
                <label>Rating:</label>
                <Rating initialValue={4}
                    onClick={this.handleInputRatingChange}
                    allowHover={true}
                    disableFillHover={false}
                    transition={true}
                ></Rating>

                <button type="submit">Submit</button>
            </form>
          </div>
        );
      }
}