// This class is a React component that represents a form for selecting privacy settings. It includes radio buttons to choose between "public", "private", or "friends" settings, and checkboxes for selecting specific friends if "friends" is selected.

import React from 'react';
import '../styles/cmp.css'; // Importing a CSS file for styling

interface PrivacyProps {
  privacy: string;
  friends?: string[]; // Optional prop for the list of friends to display
}

interface PrivacyState {
  selectedPrivacy: string; // The currently selected privacy option
  selectedFriends: string[]; // An array of selected friends (only used if "friends" is selected)
}

class PrivacyComponent extends React.Component<PrivacyProps, PrivacyState> {
  constructor(props: PrivacyProps) {
    super(props);
    // Initialize the component's state with the given props
    this.state = {
      selectedPrivacy: props.privacy,
      selectedFriends: props.friends || [], // If friends prop is not provided, set it to an empty array
    };
  }

  // Event handler for when the privacy option is changed
  handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ selectedPrivacy: event.target.value });
  };

  // Event handler for when a friend checkbox is checked or unchecked
  handleFriendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const friendName = event.target.value;
    if (this.state.selectedFriends.includes(friendName)) {
      // If the friend is already selected, remove them from the selectedFriends array
      this.setState({
        selectedFriends: this.state.selectedFriends.filter((name) => name !== friendName),
      });
    } else {
      // If the friend is not selected, add them to the selectedFriends array
      this.setState({
        selectedFriends: [...this.state.selectedFriends, friendName],
      });
    }
  };

  render() {
    return (
      <form>
        {/* Radio group for selecting privacy option */}
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="public"
              checked={this.state.selectedPrivacy === 'public'}
              onChange={this.handlePrivacyChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              value="private"
              checked={this.state.selectedPrivacy === 'private'}
              onChange={this.handlePrivacyChange}
            />
            Private
          </label>
          <label>
            <input
              type="radio"
              value="friends"
              checked={this.state.selectedPrivacy === 'friends'}
              onChange={this.handlePrivacyChange}
            />
            Friends
          </label>
        </div>
        {/* Checkbox group for selecting friends (only displayed if "friends" is selected) */}
        {this.state.selectedPrivacy === 'friends' && (
          <div className="checkbox-group">
            {this.props.friends?.map((friend) => (
              <label key={friend}>
                <input
                  type="checkbox"
                  value={friend}
                  checked={this.state.selectedFriends.includes(friend)}
                  onChange={this.handleFriendChange}
                />
                {friend}
              </label>
            ))}
          </div>
        )}
      </form>
    );
  }
}

export default PrivacyComponent; // Exporting the component to be used in other parts of the application.