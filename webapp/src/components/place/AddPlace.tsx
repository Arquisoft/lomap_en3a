import React, { ChangeEvent, Component } from "react";
import LeafletMapAdapter from "../../adapters/map/LeafletMapAdapter";
import Place from "../../domain/Place";
import Placemark from "../../domain/Placemark";
import '../../styles/AddPlace.css'
import PODManager from "../../adapters/solid/PODManager";
import PrivacyComponent from "./PrivacyComponent";
import Map from "../../domain/Map";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import User from "../../domain/User";
import Group from "../../domain/Group";
import {PlaceCategory} from "../../domain/place/PlaceCategory";
import { addPlace } from "../../api/api";

// Define the state type.
interface IState {
	name: string;
	latitude: number;
	longitude: number;
  	category: string;
	description: string;
	photosSelected: File[]; // The array of photos.
	nameError: string;
  	categoryError: string;
	latitudeError: string;
	longitudeError: string;
	descriptionError: string;
	visibility: string;
	friends: User[];
	goBack: boolean;
	open: boolean;
}

// Define the props type.
interface IProps{
	placemark: Placemark;
	callback?: Function;
	map?: Map;
	open: boolean;
	public: boolean;
}

export default class AddPlace extends React.Component<IProps, IState> {
	pod: PODManager = new PODManager();


	// Define default values for the page. This would not be necessary when the page is indexed.
	public static defaultProps: IProps = {
		placemark: new Placemark(0.5, 0.2, "asdf"),
		open: false,
		public: false,
	};

	public constructor(props: IProps) {
		super(props);

		// The state is the Place object that will be created and passed to the next function.
		// It is constructed by the props of the Placemark where the place is.
		this.state = {
			name: "",
			latitude: this.props.placemark.getLat(),
			longitude: this.props.placemark.getLng(),
      		category: "Restaurant",
			photosSelected: [],
			description: "",
			nameError: "",
      		categoryError: "",
			latitudeError: "",
			longitudeError: "",
			descriptionError: "",
			visibility: "public",
			friends: [],
			goBack: false,
			open: this.props.open,
		};

		// Binding the calls.
    	this.getCategoryList = this.getCategoryList.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handlePhotoChange = this.handlePhotoChange.bind(this);
		this.handleClearImage = this.handleClearImage.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	// Function that returns the category list.
	getCategoryList() : string[] {
		return Object.keys(PlaceCategory);
	}


	// Fill in the state.
	// When a value is modified in the form (onChange function) the value of the state is updated.
	handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		} as unknown as Pick<IState, keyof IState>);
	}

	// Fill the array of photographies
	handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
		// Get the length of the files array.
		if (event.target.files != null){
			let filesLength = event.target.files.length;
			// Use a for loop to iterate through each file.
			for (let i = 0; i < filesLength; i++) {
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

	//Callback function to pass it to the PrivacyComponent
	//It updates the privacy of the place
	handleVisibilityChange = (privacy: string, friends: User[]) => {
		this.setState({ visibility: privacy });
		this.setState({ friends: friends });
	}

	goBack() {
        this.setState({goBack: true});
    }

	// When the submit button is pressed, the parameters are validated and the object Place is created.
	// Here is where this object should be taken from to make it persistent.
	async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		let isFormValid : boolean;
		isFormValid = true;

		//Validating parameters.
		if (!this.state.name) {
			this.setState({ nameError: "Name is required" });
			isFormValid = false;
		}
		if (!this.state.latitude || !this.state.longitude) {
			this.setState({ latitudeError: "Latitude and longitude are required" });
			isFormValid = false;
		}
		if (isNaN(this.state.latitude) || isNaN(this.state.longitude)) {
			this.setState({ latitudeError: "Latitude and longitude must be numbers" });
			isFormValid = false;
		}
		/*
		if (this.state.latitude < -90 || this.state.latitude > 90) {
			this.setState({ latitudeError: "Latitude must be between -90 and 90 degrees" });
			isFormValid = false;
		}
		if (this.state.longitude < -180 || this.state.longitude > 180) {
			this.setState({ longitudeError: "Longitude must be between -180 and 180 degrees" });
			isFormValid = false;
		}
		*/
		if (!this.state.description) {
			this.setState({ descriptionError: "Description is required" });
			isFormValid = false;
		}
		if (!this.state.category) {
		this.setState({ categoryError: "Category is required" });
			isFormValid = false;
		}

		if (!isFormValid) {
			return;
		}


		// Handle form submission logic here.
		var place = new Place(this.state.name, this.state.latitude, this.state.longitude,
			this.state.description, this.state.photosSelected,undefined ,this.state.category);
	
		let placeUrl = this.pod.getBaseUrl() + "/data/places/" + place.uuid;
		if (this.props.public){
			addPlace(new Placemark(
			this.state.latitude, this.state.longitude, this.state.name, placeUrl, this.state.category
			));
		}
		this.createPlace(place, placeUrl)
		if (this.props.callback !== undefined) {
			this.props.callback(new Placemark(
			this.state.latitude, this.state.longitude, this.state.name, placeUrl, this.state.category
			));
			return <LeafletMapAdapter></LeafletMapAdapter>
		}
	}

	private async createPlace(place:Place, placeUrl:string) {
		await this.pod.savePlace(place);
		
		switch (this.state.visibility) {
			case "public":
				await this.pod.changePlacePublicAccess(place, true);
				break;
        
			case "private":
				await this.pod.changePlacePublicAccess(place, false);
				break;
		}
		
		if (this.state.friends.length > 0) {
			let group = new Group("", this.state.friends);
			await this.pod.setGroupAccess(placeUrl, group, {'Permission read': true});
		}
	}


	public render(): JSX.Element {
		if (this.state.goBack) {
            return <LeafletMapAdapter map={this.props.map}/>;
        }

		return (
			<Modal open={this.state.open} onClose={() => {
                this.setState(({open: false}));
                this.goBack();
            }}>
                <ModalDialog className="custom-modal-dialog">
                    <ModalClose/>
                    <section className="Place-form">
						<h2>Fill the information of the new place.</h2>
						<form onSubmit={this.handleSubmit}>
						<div>
							<label htmlFor="name">Name:</label>
							<input
								type="text"
								name="name"
								placeholder="Name"
								onChange={this.handleInputChange}
							/>
						</div>
						{this.state.nameError && <span className="error">{this.state.nameError}</span>}
						<div>
							<h3>Location:</h3> 
							<p>longitude ({this.state.longitude}) and latitude ({this.state.latitude}).</p>
						</div>
						<div>
							<label htmlFor="category">Category:</label>
							<select title="category" name="category" value={this.state.category} onChange={this.handleInputChange}>
							{this.getCategoryList().map((category) => (
								<option key={category} value={category}>{category}</option>
							))}
							</select>
						</div>
						{this.state.categoryError && <span className="error">{this.state.categoryError}</span>}
						<div>
							<label htmlFor="description">Description:</label>
							<textarea
								name="description"
								placeholder="Introduce a description"
								onChange={this.handleInputChange}
							/>
						</div>
						{this.state.descriptionError && <span className="error">{this.state.descriptionError}</span>}
						<div>
							<label htmlFor="photo">Photo:</label>
							<input title="photo" placeholder="Choose a photo" type="file" name="photo" onChange={this.handlePhotoChange} />
						</div>
						
						<div id="visibility">
							<h3>Select the visibility of the place:</h3>
								<PrivacyComponent updatePrivacy={this.handleVisibilityChange}/>
						</div>
						<button type="submit">Submit</button>
						</form>
						{/* Display all uploaded photos using map function */}
						{this.state.photosSelected.map((file) => (
							<PhotoPreview key={file.name} file={file} onDelete={this.handleDeleteImage}/>
						))}

						{/* Use a button or a link element with onClick attribute */}
						{this.state.photosSelected.length > 1 && (<button onClick={this.handleClearImage}>Clear photos</button>)}

                    </section>
                </ModalDialog>
            </Modal>
		);
	}  
}

// Interface for the props of PhotoPreview component.
// onDelete is a function that will be called when the user clicks the "Delete photo" button to delete the photo.
// this function is passed as parameter by its parent and is the way to control it. That method from the parent is called
// inside this component so that the parent deletes the image that this component is using.
interface Props {
	file: File;
	onDelete: (fileName: string) => void;
}

//interface for the state of PhotoPreview component.
interface State {
	url: string;
	name: string;
}

// Component for displaying the images that were uploaded.
export class PhotoPreview extends Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			url: "",
			name: ""
		};
		
		this.createUrl(this.props.file);
		// Binding the call.
		this.handleDelete = this.handleDelete.bind(this);
	}

	// Lifecycle method.
	// Method that is called when the component is mounted.
	componentDidMount() {
		this.createUrl(this.props.file);
	}

	// Lifecycle method.
	// Method that updates the component when the props of the component are updated.
	componentDidUpdate(prevProps: Props) {
		if (prevProps.file !== this.props.file) {
			this.createUrl(this.props.file);
		}
	}

	// Lifecycle method.
	// This method cleans up the created url when the component is no longer used.
	componentWillUnmount() {
		URL.revokeObjectURL(this.state.url);
	}

	// Creates a URL for the image and .
	createUrl(file: File){
		if (file != null) {
			const comUrl = URL.createObjectURL(file);
			this.setState({ url: comUrl });
			this.setState({ name: file.name});
		}
	};

	// This method is called inside the component to let the parent delete the image or handle the delete the way it wants.
	handleDelete(){
		this.props.onDelete(this.props.file.name);
	};

	render() {
		const { url, name } = this.state;
		return (
		<div className="photo-preview">
			<h2>Preview of {name}</h2>
			<img src={url} alt="" />
			<button onClick={this.handleDelete} type="submit">Delete photo</button>
		</div>
		);
	}
}