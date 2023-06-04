import {Rating} from "react-simple-star-rating";
import {PhotoPreview} from "./AddPlace";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import React, {ChangeEvent} from "react";
import IPlacePageProps from "./IPlacePage";
import PlaceComment from "../../domain/place/PlaceComment";
import PlaceRating from "../../domain/place/PlaceRating";
import IPlacePageState from "./IPlacePage";
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
import PODManager from "../../adapters/solid/PODManager";
import LoadingPage from "../basic/LoadingPage";

interface AddReviewState extends IPlacePageState {
    comment: string;
    rating: number;
    photosSelected: File[];
    photosError: string;
    commentError: string;
    submitedInput: boolean;
    openModal: boolean;
}

interface AddReviewProps extends IPlacePageProps {
    pod: PODManager,
    placeUrl: string,
    callback: () => void
}

export default class AddReview extends React.Component<AddReviewProps, AddReviewState> {

    private sessionManager: SolidSessionManager = SolidSessionManager.getManager();

    constructor(props: AddReviewProps) {
        super(props);
        this.state = {
            place: props.place,
            comment: "",
            rating: 3,
            photosSelected: [],
            photosError: "",
            commentError: "",
            placeUrl: props.placeUrl,
            submitedInput: false,
            openModal: false
        }

        //Binding
        this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputRatingChange = this.handleInputRatingChange.bind(this);
        this.handlePhotoChange = this.handlePhotoChange.bind(this);
        this.handleClearImage = this.handleClearImage.bind(this);
        this.handleDeleteImage = this.handleDeleteImage.bind(this);
        this.handleSubmitComment = this.handleSubmitComment.bind(this);
        this.handleSubmitRating = this.handleSubmitRating.bind(this);
        this.handleSubmitPhoto = this.handleSubmitPhoto.bind(this);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        } as unknown as Pick<AddReviewState, keyof IPlacePageProps>);
    }

    /**
     * Submits a review, it first submits the comment and then, once uploaded
     * it submits the comment and updates the whole reviews page
     * @param event
     */
    handleReviewSubmit(event: React.FormEvent<HTMLFormElement>) {
        this.setState(({
            openModal: true
        }));
        this.handleSubmitComment(event).then(() => {
            this.handleSubmitRating(event).then(() => {
                this.setState({
                    submitedInput: true
                });
                this.props.callback();
            });
        });
    }

    handleInputRatingChange(rate: number) {
        this.setState({
            rating: rate,
        } as unknown as Pick<AddReviewState, keyof IPlacePageProps>);
    }

    /**
     * Fill the array of photographies
     * TODO: this code is duplicated, we could consider creating an external class or function
     * @param event
     */
    handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
        // Get the length of the files array.
        if (event.target.files != null) {
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

    isPhotoInArray(photo: File, photosSelected: File[]): boolean {
        for (let i = 0; i < photosSelected.length; i++) {
            if (photo.name === photosSelected[i].name) {
                return true;
            }
        }
        return false;
    }

    // Define a handler function that empties the state array.
    handleClearImage() {
        // Set the state array to an empty array using setState function.
        this.setState({photosSelected: []});
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

    private async handleSubmitComment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const comment = new PlaceComment(this.sessionManager.getWebID(), this.state.comment);
        //Here the persistence of the object

        let isValid = true;
        if (!this.state.comment || this.state.comment.trim().length === 0) {
            this.setState({commentError: "You must enter a comment."});
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        if (this.props.placeUrl !== undefined) {
            let placeUrl = this.props.placeUrl;
            await this.props.pod.comment(comment, placeUrl); //run asynchronously
        }
        this.setState({
            commentError: "",
            comment: ""
        });

    };

    private async handleSubmitRating(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        var rating = new PlaceRating(this.sessionManager.getWebID(), this.state.rating);

        if (this.props.placeUrl !== undefined) {
            let placeUrl = this.props.placeUrl;
            await this.props.pod.review(rating, placeUrl); //run asynchronously
        }
    };

    handleSubmitPhoto(event: React.FormEvent<HTMLFormElement>) {
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
         * Iterate through the array of photos and upload them to the POD
         */
        if (this.props.placeUrl !== undefined) {
            let placeUrl = this.props.placeUrl;
            this.state.photosSelected.forEach(photo => {
                this.props.pod.addImage(photo, placeUrl);
            });
            this.setState(({
                submitedInput: true
            }))
            this.handleClearImage();
        }
    };

    render() {
        return (
            <>
                <form onSubmit={this.handleReviewSubmit}>

                    {/** Rating **/}

                    <h3 style={{fontSize: "x-large", marginTop: 0}}>Rating:</h3>
                    <Rating initialValue={3}
                            onClick={this.handleInputRatingChange}
                            allowHover={true}
                            disableFillHover={false}
                            transition={true}
                    ></Rating>

                    {/** Comment **/}

                    <label style={{fontSize: "x-large"}} htmlFor="comment">Comment:</label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={this.state.comment}
                        onChange={this.handleInputChange}
                        required
                        style={{resize: "none"}}
                    />
                    {this.state.commentError && <span className="error">{this.state.commentError}</span>}
                    <button name="review" type="submit">Submit review</button>
                </form>

                {/** Images **/}

                <form onSubmit={this.handleSubmitPhoto}>
                    <label htmlFor="photo" style={{fontSize: "x-large"}}>Photo:</label>
                    <input title="photo" placeholder="Choose a photo" type="file"
                           onChange={this.handlePhotoChange}/>
                    {/* Display all uploaded photos using map function */}
                    {this.state.photosSelected.map((file) => (
                        <PhotoPreview key={file.name} file={file} onDelete={this.handleDeleteImage}/>
                    ))}

                    {/* Use a button or a link element with onClick attribute */}
                    {this.state.photosSelected.length > 1 && (
                        <button onClick={this.handleClearImage} name="clear">Clear photos</button>)}

                    <button name="photos" type="submit">Upload photos</button>
                    {this.state.photosError && <span className="error">{this.state.photosError}</span>}
                </form>

                {/** Once the modal closes the states for open and submitedInput MUST be false **/}
                <Modal open={this.state.openModal} onClose={() => {
                    this.setState(({openModal: false, submitedInput: false}))
                }} style={{height: "15em", width: "10em", position: "absolute", left: "45%", top: "35%"}}>
                    <ModalDialog className="custom-modal-dialog">
                        {this.state.submitedInput && <ModalClose/>}
                        <div>
                            {!this.state.submitedInput && <LoadingPage/>}
                            {this.state.submitedInput &&
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <h2>Done!</h2>
                                    <CheckCircleSharpIcon color={"success"} sx={{fontSize: "4em", marginLeft: "40%"}}/>
                                </div>
                            }
                        </div>
                    </ModalDialog>
                </Modal>
            </>
        );
    }
}