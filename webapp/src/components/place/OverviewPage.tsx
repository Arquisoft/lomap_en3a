import React, { ChangeEvent } from "react";
import {Rating} from "react-simple-star-rating";
import IPlacePageProps from "./IPlacePage";
import IPlacePageState from "./IPlacePage";
import "../../styles/OverviewPage.css"; // Import the CSS file
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
import PlaceComment from "../../domain/Place/PlaceComment";
import PlaceRating from "../../domain/Place/PlaceRating";
import { PhotoPreview } from "./AddPlace";
import PlacePhotos from "../../domain/Place/PlacePhotos";
import PODManager from "../../adapters/solid/PODManager";

interface OverviewPageState extends IPlacePageState {
    comment: string;
    rating: number;
    photosSelected: File[];
    photosError: string;
    commentError: string;
}

export default class OverviewPage extends React.Component<IPlacePageProps, OverviewPageState> {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();
    private pod = new PODManager();

    public constructor(props : IPlacePageProps) {
        super(props);
        this.state = {
            place: props.place,
            comment: "",
            rating: 0,
            photosSelected: [],
            photosError: "",
            commentError: ""
        }

        //Binding
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputRatingChange = this.handleInputRatingChange.bind(this);
		this.handlePhotoChange = this.handlePhotoChange.bind(this);
		this.handleClearImage = this.handleClearImage.bind(this);
		this.handleDeleteImage = this.handleDeleteImage.bind(this);
		this.handleSubmitComment = this.handleSubmitComment.bind(this);
		this.handleSubmitRating = this.handleSubmitRating.bind(this);
		this.handleSubmitPhoto = this.handleSubmitPhoto.bind(this);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		} as unknown as Pick<OverviewPageState, keyof IPlacePageProps>);
    }

    handleInputRatingChange (rate : number) {
		this.setState({
			rating: rate,
		} as unknown as Pick<OverviewPageState, keyof IPlacePageProps>);
    }
	// Fill the array of photographies
	handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
		// Get the length of the files array.
		if (event.target.files != null){
			let filesLength = event.target.files.length;
			// Use a for loop to iterate through each file.
			for (let i = 0; i < filesLength; i++) {
				// Get the current file from the array.
				let photo = event.target.files[i];
				// Check if the photo is already in the photosSelected array
				if (!this.isPhotoInArray(photo, this.state.photosSelected)) {
					this.setState((prevState) => ({
						photosSelected: [...prevState.photosSelected, photo]
					}));
				}
			}
		}
	}


    isPhotoInArray(photo: File, photosSelected: File[]) : boolean {
		for (let i = 0; i < photosSelected.length; i++) {
			if (photo.name === photosSelected[i].name) {
				return true;
			}
		}
		return false;
	}

	// Define a handler function that empties the state array.
	handleClearImage(){
		// Set the state array to an empty array using setState function.
		this.setState({ photosSelected: [] });
	}

	// Define a handler function that deletes a specific file from the state array.
	handleDeleteImage = (fileName: string) => {
		// Remove the file with matching name from the state array using setState function with a callback argument and filter method.
		this.setState((prevState) => ({
			photosSelected: prevState.photosSelected.filter(
				(file) => file.name !== fileName
			)
		}));
	};

    handleSubmitComment (event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        var comment = new PlaceComment(this.sessionManager.getWebID(), this.state.comment);
        //Here the persistence of the object

        var isValid = true;
        if (!this.state.comment || this.state.comment.trim().length == 0) {
            this.setState({commentError: "You must enter a comment."});
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        /**
         * This is for the new implementation of the comments
         */
        if (this.props.placeUrl !== undefined) {
            let placeUrl = this.props.placeUrl;
            this.pod.comment(comment, placeUrl); //run asynchronously
        }

        //this.pod.comment(comment, this.state.place); //run asynchronously
        this.setState({commentError: ""});
        
        console.log("Form submitted, comment:", comment);
    };

    handleSubmitRating (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        var rating = new PlaceRating(this.sessionManager.getWebID(), this.state.rating);
        //Here the persistence of the object
        /**
         * This is for the new implementation of the reviews
         */
        if (this.props.placeUrl !== undefined) {
            let placeUrl = this.props.placeUrl;
            this.pod.review(rating, placeUrl); //run asynchronously
        }
        //this.pod.review(rating, this.state.place) //run asynchronously
        console.log("Form submitted, rating:", rating);
    };

    handleSubmitPhoto (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        var isValid = true;

        if (!this.state.photosSelected || this.state.photosSelected.length === 0) {
            this.setState({photosError: "You must select at least one photo."});
            isValid = false;
        }

        if (!isValid) {
            return;
        }
        this.setState({photosError: ""});

        /**
         * This is for the new implementation of the photos
         */
        if (this.props.placeUrl !== null) {
            let placeUrl = this.props.placeUrl;
            //var photo = new PlacePhotos(placeUrl, this.sessionManager.getWebID(), this.state.photosSelected);
        }

        var photo = new PlacePhotos(this.state.place, this.sessionManager.getWebID(), this.state.photosSelected);
        //Here the persistence of the object

        console.log("Form submitted, photo:", photo);
    };

    render() {    
        return (
          <div className="OverviewPage">
            <div>
                <h2>{this.state.place.description}</h2>
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
                <button type="submit">Publish a comment</button>
            </form>
            {this.state.commentError && <span className="error">{this.state.commentError}</span>}

            <form onSubmit={this.handleSubmitRating}>
                <label>Rating:</label>
                <Rating initialValue={4}
                    onClick={this.handleInputRatingChange}
                    allowHover={true}
                    disableFillHover={false}
                    transition={true}
                ></Rating>

                <button type="submit">Submit a review</button>
            </form>

            <form onSubmit={this.handleSubmitPhoto}>
                <label htmlFor="photo">Photo:</label>
				<input title="photo" placeholder="Choose a photo" type="file" onChange={this.handlePhotoChange} />                
                {/* Display all uploaded photos using map function */}
                {this.state.photosSelected.map((file) => (
                    <PhotoPreview key={file.name} file={file} onDelete={this.handleDeleteImage}/>
                ))}

                {/* Use a button or a link element with onClick attribute */}
                {this.state.photosSelected.length > 1 && (<button onClick={this.handleClearImage} name="clear">Clear photos</button>)}

                <button name="photos" type="submit">Upload photos</button>
                {this.state.photosError && <span className="error">{this.state.photosError}</span>}
            </form>
          </div>
        );
      }
}