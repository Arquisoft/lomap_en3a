import React, { Component } from "react";
import "../styles/PrivacyComponent.css";

interface PrivacyComponentProps {
  friends: string[];
  //callback function to update the privacy of the place
  updatePrivacy: (privacy: string, friends: string[]) => void;
}

interface PrivacyComponentState {
  selectedPrivacy: string;
  selectedFriends: { [key: string]: boolean };
}

/**
 * PrivacyComponent is a component that allows the user to select the privacy of a place.
 * There are three privacy options: public, private, and friends.
 * Once friends is selected, a set of checkboxes will appear to allow the user to select which friends can see the place.
 */
class PrivacyComponent extends Component<PrivacyComponentProps, PrivacyComponentState> {
  constructor(props: PrivacyComponentProps) {
    super(props);
    this.state = {
      selectedPrivacy: "public",
      selectedFriends: {},
    };
  }

  /**
   * Handle the change of the privacy radio buttons.
   * @param e The event of the change.
   */
  handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ selectedPrivacy: e.target.value });
    
    //When privacy is changed, the callback function is called to update the privacy of the place
    this.props.updatePrivacy(this.state.selectedPrivacy, Object.keys(this.state.selectedFriends).filter((friend) => this.state.selectedFriends[friend]));

  };

  /**
   * Handle the change of the friend checkboxes.
   * @param e The event of the change.
   */
  handleFriendToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const friend = e.target.value;
    const { selectedFriends } = this.state;
    selectedFriends[friend] = !selectedFriends[friend];
    this.setState({ selectedFriends });

    //When friends are changed, the callback function is called to update the privacy of the place
    this.props.updatePrivacy(this.state.selectedPrivacy, Object.keys(this.state.selectedFriends).filter((friend) => this.state.selectedFriends[friend]));

  };

  
  render() {
    const { friends } = this.props;
    const { selectedPrivacy, selectedFriends } = this.state;

    return (
      <div>
        <div className="privacy-options">
          {/*Radio button for public privacy*/}
          <label className={`radio-option ${selectedPrivacy === "public" ? "selected" : ""}`}>
            <input
              type="radio"
              name="privacy"
              value="public"
              checked={selectedPrivacy === "public"}
              onChange={this.handlePrivacyChange}
            />
            Public
          </label>
          {/*Radio button for private privacy*/}
          <label className={`radio-option ${selectedPrivacy === "private" ? "selected" : ""}`}>
            <input
              type="radio"
              name="privacy"
              value="private"
              checked={selectedPrivacy === "private"}
              onChange={this.handlePrivacyChange}
            />
            Private
          </label>
          {/*Radio button for friends privacy*/}
          <label className={`radio-option ${selectedPrivacy === "friends" ? "selected" : ""}`}>
            <input
              type="radio"
              name="privacy"
              value="friends"
              checked={selectedPrivacy === "friends"}
              onChange={this.handlePrivacyChange}
            />
            Friends
          </label>
        </div>
        {/*Display the friend checkboxes if friends privacy is selected*/}
        {selectedPrivacy === "friends" && friends.length > 0 && (
          <div className="friend-options">
            {friends.map((friend) => (
              <label key={friend} className={`checkbox-option ${selectedFriends[friend] ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  name="friends"
                  value={friend}
                  checked={selectedFriends[friend]}
                  onChange={this.handleFriendToggle}
                />
                {friend}
              </label>
            ))}
          </div>
        )}
        {/*Display a message if there are no friends to select*/}
        {selectedPrivacy === "friends" && friends.length == 0 && (
          <div className="friend-options">
            <p>You have no friends.</p>
          </div>
        )}
      </div>
    );
  }
}

export default PrivacyComponent;