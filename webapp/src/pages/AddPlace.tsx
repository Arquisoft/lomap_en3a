import React, { ChangeEvent, Component, useEffect } from "react";
import MapPoint from "../domain/Place";
import Placemark from "../domain/Placemark";
import '../styles/AddPlace.css'

// Define the state type
interface IState {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  photosSelected: File[]; // The array of photos
}

// Define the props type
interface IProps{
  placemark: Placemark;
}

export default class AddPlace extends React.Component<IProps, IState> {
  defName: string = "Name";
  defDescription: string = "Description.";


  // Define default values for the page. This would not be necessary when the page is indexed
  public static defaultProps: IProps = {
      placemark: new Placemark(0.5, 0.2, "asdf")
  };

  public constructor(props: IProps) {
    super(props);

    // The state is the Place object that will be created and passed to the next function
    // It is constructed by the props of the Placemark where the place is
    this.state = {
      name: this.defName,
      latitude: this.props.placemark.getLat(),
      longitude: this.props.placemark.getLng(),
      description: this.defDescription,
      photosSelected: [],
    };

    // Binding the calls
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePhotoChange = this.handlePhotoChange.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Fill in the state
  handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    } as unknown as Pick<IState, keyof IState>);
  }

  // Fill the array of photographies
  handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    // Get the length of the files array
    if (event.target.files != null){
      let filesLength = event.target.files.length;
      // Use a for loop to iterate through each file
      for (let i = 0; i < filesLength; i++) {
        // Get the current file from the array
        let photo = event.target.files[i];
        // Add each file to the state array using setState function with a callback argument
        this.setState((prevState) => ({
          photosSelected: [...prevState.photosSelected, photo]
        }));

      }
    }
  }


  // Define a handler function that empties the state array
  handleClearImage(){
    // Set the state array to an empty array using setState function
    this.setState({ photosSelected: [] });
  }

  // Define a handler function that deletes a specific file from the state array
  handleDeleteImage = (fileName: string) => {
    // Remove the file with matching name from the state array using setState function with a callback argument and filter method
    this.setState((prevState) => ({
      photosSelected: prevState.photosSelected.filter(
        (file) => file.name !== fileName
      )
    }));
  };

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //Validating parameters
    if (!this.state.name) {
      alert("Name is required");
      return;
    }
    if (this.state.name === this.defName) {
      alert("Name cannot be '" + this.defName + "'");
      return;
    }
    if (!this.state.latitude || !this.state.longitude) {
      alert("Latitude and longitude are required");
      return;
    }
    if (isNaN(this.state.latitude) || isNaN(this.state.longitude)) {
      alert("Latitude and longitude must be numbers");
      return;
    }
    if (this.state.latitude < -90 || this.state.latitude > 90) {
      alert("Latitude must be between -90 and 90 degrees");
      return;
    }
    if (this.state.longitude < -180 || this.state.longitude > 180) {
      alert("Longitude must be between -180 and 180 degrees");
      return;
    }
    if (!this.state.description) {
      alert("Description is required");
      return;
    }
    if (this.state.description === this.defDescription) {
      alert("Description cannot be '" + this.defDescription + "'");
      return;
    }
    if (!this.state.photosSelected || this.state.photosSelected.length === 0) {
      alert("At least one photo is required");
      return;
    }
    // Handle form submission logic here
    console.log("Form submitted:", this.state);

    var place = new MapPoint(this.state.name, this.state.latitude, this.state.longitude, this.state.description, this.state.photosSelected);

    //Here has to be the rest of the logic for persitence on pods
    //Here
    //Here 







    //Here
  }

  public render(): JSX.Element {
    return (
      <section className="Place-form">
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="number"
              min="-90"
              max="90"
              step="0.000001"
              name="latitude"
              value={this.state.latitude}
              onChange={this.handleInputChange}
              disabled
            />
          </div>
          <div>
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="number"
              min="-90"
              max="90"
              step="0.000001"
              name="longitude"
              value={this.state.longitude}
              onChange={this.handleInputChange}
              disabled
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              value={this.state.description}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="photo">Photo:</label>
            <input type="file" name="photo" onChange={this.handlePhotoChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
        {/* Display all uploaded photos using map function */}
        {this.state.photosSelected.map((file) => (
          <PhotoPreview key={file.name} file={file} onDelete={this.handleDeleteImage}/>
        ))}

        {/* Use a button or a link element with onClick attribute */}
        <button onClick={this.handleClearImage}>Clear photos</button>
      </section>
    );
  }  
}

interface Props {
  file: File;
  onDelete: (fileName: string) => void;
}

interface State {
  url: string;
  name: string;
}

class PhotoPreview extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      url: "",
      name: ""
    };
    
    this.createUrl(this.props.file);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.createUrl(this.props.file);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.file !== this.props.file) {
      this.createUrl(this.props.file);
    }
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.state.url);
  }

  createUrl(file: File){
    if (file != null) {
      const blobUrl = URL.createObjectURL(file);
      this.setState({ url: blobUrl });
      this.setState({ name: file.name});
    }
  };

  handleDelete(){
    this.props.onDelete(this.props.file.name);
  };

  render() {
    const { url, name } = this.state;
    return (
      <div className="photo-preview">
        <h2>Preview of {name}</h2>
        <img src={url} alt="Uploaded photo" />
        <button onClick={this.handleDelete}>Delete photo</button>
      </div>
    );
  }
}