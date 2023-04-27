import React, { Component } from "react";
import "../styles/PrivacyComponent.css";
import User from "../domain/User";
import FriendManager from "../adapters/solid/FriendManager";
import { map } from "leaflet";
import LoadingPage from "./basic/LoadingPage";

interface PrivacyComponentProps {
  //callback function to update the privacy of the place
  updatePrivacy: (privacy: string, friends: User[]) => void;
}

interface PrivacyComponentState {
  selectedPrivacy: string;
  selectedFriends: { [key: string]: boolean };
  friends: User[];
  loadedFriends: boolean;
  friendsList: User[];
}

/**
 * PrivacyComponent is a component that allows the user to select the privacy of a place.
 * There are three privacy options: public, private, and friends.
 * Once friends is selected, a set of checkboxes will appear to allow the user to select which friends can see the place.
 */
class PrivacyComponent extends Component<PrivacyComponentProps, PrivacyComponentState> {
  
  private loadedFriends: boolean = false;
  constructor(props: PrivacyComponentProps) {
    super(props);
    this.state = {
      selectedPrivacy: "public",
      selectedFriends: {},
      friendsList: [],
      friends: [],
      loadedFriends: false,
    };

    // We assign to users the actual list of users
    this.getUsers().then(() => {
      if (this.state.friendsList.length == 0) {
        this.setState(() => ({
          loadedFriends: false,
        }));
      } else {
        this.setState(() => ({
          loadedFriends: true,
        }));
      }
    }).catch((error) => {
      console.log("There was an error uploading the friends: " + error.message);
    });
  }

  public async componentDidMount(): Promise<void> {
    this.setState({friendsList: await this.getUsers()});
  }

  /**
   * It recovers the friends from the current user logged in
   * */
  private async getUsers() {
    const fm = new FriendManager();
    return await fm.getFriendsList();
  }

  /**
   * Handle the change of the privacy radio buttons.
   * @param e The event of the change.
   */
  handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ selectedPrivacy: e.target.value });
    
    //When the privacy changes, we fill the list friends with the friends from the user in the friendsList that are in the selectedFriends
    const { selectedFriends } = this.state;
    const friends = this.state.friendsList.filter((friend) => selectedFriends[friend.getName()??""]);
    this.setState({ friends });
    //When privacy is changed, the callback function is called to update the privacy of the place
    this.props.updatePrivacy(e.target.value, this.state.friends);
  };

  /**
   * Handle the change of the friend checkboxes.
   * @param e The event of the change.
   */
  handleFriendToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const friendName = e.target.value;
    const { selectedFriends } = this.state;
    const friend = this.state.friendsList.find((friend) => friend.getName() === friendName);

    this.setState({ selectedFriends });

    //When friends are changed, the callback function is called to update the privacy of the place
    
  };

  
  render() {
    return (
      <div>
        <div className="privacy-options">
          {/*Radio button for public privacy*/}
          <label className={`radio-option ${this.state.selectedPrivacy === "public" ? "selected" : ""}`}>
            <input
              type="radio"
              name="privacy"
              value="public"
              checked={this.state.selectedPrivacy === "public"}
              onChange={this.handlePrivacyChange}
            />
            Public
          </label>
          {/*Radio button for private privacy*/}
          <label className={`radio-option ${this.state.selectedPrivacy === "private" ? "selected" : ""}`}>
            <input
              type="radio"
              name="privacy"
              value="private"
              checked={this.state.selectedPrivacy === "private"}
              onChange={this.handlePrivacyChange}
            />
            Private
          </label>
          {/*Radio button for friends privacy*/}
          <label className={`radio-option ${this.state.selectedPrivacy === "friends" ? "selected" : ""}`}>
            <input
              type="radio"
              name="privacy"
              value="friends"
              checked={this.state.selectedPrivacy === "friends"}
              onChange={this.handlePrivacyChange}
            />
            Friends
          </label>
        </div>
        {/*Display the friend checkboxes if friends privacy is selected*/}
        {this.state.loadedFriends && this.state.selectedPrivacy === "friends" && this.state.friendsList.length > 0 && (
          <div className="friend-options">
            {this.state.friendsList.map((friend) => (
              <label key={friend.getName()} className={`checkbox-option ${this.state.selectedFriends[friend.getName()??""] ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  name="friends"
                  value={friend.getName()??""}
                  checked={this.state.selectedFriends[friend.getName()??""]}
                  onChange={this.handleFriendToggle}
                />
                {friend.getName()}
              </label>
            ))}
          </div>
        )}
        {/*Display a message if there are no friends to select*/}
        {this.state.loadedFriends && this.state.selectedPrivacy === "friends" && this.state.friendsList.length == 0 && (
          <div className="friend-options">
            <p>You have no friends.</p>
          </div>
        )}
        {!this.state.loadedFriends && this.state.selectedPrivacy === "friends" && 
          <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>
        }
      </div>
    );
  }
}

export default PrivacyComponent;