import React from 'react';
import '../styles/cmp.css';

interface PrivacyProps {
  privacy: string;
  friends?: string[];
}

interface PrivacyState {
  selectedPrivacy: string;
  selectedFriends: string[];
}

class PrivacyComponent extends React.Component<PrivacyProps, PrivacyState> {
  constructor(props: PrivacyProps) {
    super(props);
    this.state = {
      selectedPrivacy: props.privacy,
      selectedFriends: props.friends || [],
    };
  }

  handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ selectedPrivacy: event.target.value });
  };

  handleFriendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const friendName = event.target.value;
    if (this.state.selectedFriends.includes(friendName)) {
      this.setState({
        selectedFriends: this.state.selectedFriends.filter((name) => name !== friendName),
      });
    } else {
      this.setState({
        selectedFriends: [...this.state.selectedFriends, friendName],
      });
    }
  };

  render() {
    return (
      <form>
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

export default PrivacyComponent;