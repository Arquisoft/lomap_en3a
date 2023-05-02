import React, {Component} from "react";
import "../../styles/PrivacyComponent.css";
import User from "../../domain/User";
import FriendManager from "../../adapters/solid/FriendManager";
import {map} from "leaflet";
import LoadingPage from "../basic/LoadingPage";

interface PrivacyComponentProps {
    //callback function to update the privacy of the place
    updatePrivacy: (privacy: string, friends: User[]) => void;
}

interface PrivacyComponentState {
    selectedPrivacy: string;
    selectedFriends: { [key: string]: boolean };
    friendsSelected: User[];
    loadedFriends: boolean;
    friendsList: User[];
    friendsButton: boolean;
    prevFriendsButton: boolean;
}

/**
 * PrivacyComponent is a component that allows the user to select the privacy of a place.
 * There are two privacy options: public or private.
 * Once friends is selected, a set of checkboxes will appear to allow the user to select which friends can see the place.
 */
class PrivacyComponent extends Component<PrivacyComponentProps, PrivacyComponentState> {

    private loadedFriends: boolean = false;

    constructor(props: PrivacyComponentProps) {
        super(props);
        this.state = {
            selectedPrivacy: "public",
            selectedFriends: {},
            friendsList: new Array<User>(),
            friendsSelected: [],
            loadedFriends: false,
            friendsButton: false,
            prevFriendsButton: false,
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
            console.log("There was an error downloading the friends: " + error.message);
        });
        this.handleFriendToggle = this.handleFriendToggle.bind(this);
    }
  }

  /**
   * It recovers the friends from the current user logged in
   * */
  private async getUsers() {
    const fm = new FriendManager();
    return fm.getFriendsList();
  }

  /**
   * Handle the change of the privacy radio buttons.
   * @param e The event of the change.
   */
  handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //When the privacy changes, we fill the list friends with the friends from the user in the friendsList that are in the selectedFriends
    const friendsSelected = this.state.friendsList.filter((friend) => this.state.selectedFriends[friend.getName()??friend.getWebId()]);
    this.setState({ friendsSelected , selectedPrivacy: e.target.value}, () => {
      //When privacy is changed, the callback function is called to update the privacy of the place
      if (this.state.friendsButton) {
        this.props.updatePrivacy(this.state.selectedPrivacy, this.state.friendsSelected);
      } else {
        this.props.updatePrivacy(this.state.selectedPrivacy, []);
      }
      });
  };

  /**
   * Handle the change of the friends radio button. When it is checked the value of the friendsButton is updated.
   * if it was already checked, it is unchecked.
   * @param e The event of the change.
   * */
  handleFriendsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.prevFriendsButton) {
      // If the friends radio button was previously selected, unselect
      this.setState({ friendsButton: false, prevFriendsButton: false}, () => {
        this.props.updatePrivacy(this.state.selectedPrivacy, []);
      });
    } else {
      // If the friends radio button was not previously selected, select it
      this.setState({ friendsButton: true, prevFriendsButton: true}, () => {
        this.props.updatePrivacy(this.state.selectedPrivacy, this.state.friendsSelected);
      });
    }
  };

  /**
   * Handle the change of the friend checkboxes.
   * It updates the list of friends selected.
   * It calls the callback function to update the privacy of the place.
   * @param e The event of the change.
   */
  handleFriendToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const friendValue = e.target.value;
    const { selectedFriends } = this.state;

    //When the privacy changes, we fill the list friends with the friends from the user in the friendsList that are in the selectedFriends
    selectedFriends[friendValue] = !selectedFriends[friendValue];
    const friendsSelected = this.state.friendsList.filter((friend) => selectedFriends[friend.getName()??friend.getWebId()]);

    this.setState({ selectedFriends, friendsSelected }, () => {
       //When privacy is changed, the callback function is called to update the privacy of the place
      if (this.state.friendsButton) {
        this.props.updatePrivacy(this.state.selectedPrivacy, this.state.friendsSelected);
      } else {
        this.props.updatePrivacy(this.state.selectedPrivacy, []);
      }
    });   
  };

  
  render() {
    return (
      <div className="privacy-visibility">
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
        </div>
        {/*Display the friends privacy options if friends option is checked*/}
        <div className="privacy-friends">
          <div className="friends-options">
            {/*Radio button for friends privacy*/}
            <label className={`checkbox-option ${this.state.friendsButton ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  name="privacy"
                  value="friends"
                  checked={this.state.friendsButton}
                  onChange={this.handleFriendsChange}
                />
                Share with friends
              </label>
          </div>
          {/*Display the friend checkboxes if friends privacy is selected*/}
          {this.state.loadedFriends && this.state.friendsButton && (this.state.friendsList??[]).length > 0 && (
            <div className="friend-options">
              {(this.state.friendsList??[]).map((friend) => (
                <label key={friend.getName()} className={`checkbox-option ${this.state.selectedFriends[friend.getName()??friend.getWebId()] ? "selected" : ""}`}>
                  <input
                    type="checkbox"
                    name="friends"
                    value={friend.getName()??friend.getWebId()}
                    checked={this.state.selectedFriends[friend.getName()??friend.getWebId()]}
                    onChange={this.handleFriendToggle}
                  />
                  {friend.getName()}
                </label>
              ))}
            </div>
            )}
            {/*Display a message if there are no friends to select*/}
            {this.state.loadedFriends && this.state.friendsButton && (this.state.friendsList??[]).length == 0 && (
              <div className="friend-options">
                <p>You have no friends.</p>
              </div>
            )}
            {!this.state.loadedFriends && this.state.friendsButton && 
              <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>
            }
        });
    };

    /**
     * Handle the change of the friends radio button. When it is checked the value of the friendsButton is updated.
     * if it was already checked, it is unchecked.
     * @param e The event of the change.
     * */
    handleFriendsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.state.prevFriendsButton) {
            // If the friends radio button was previously selected, unselect
            this.setState({friendsButton: false, prevFriendsButton: false}, () => {
                this.props.updatePrivacy(this.state.selectedPrivacy, []);
            });
        } else {
            // If the friends radio button was not previously selected, select it
            this.setState({friendsButton: true, prevFriendsButton: true}, () => {
                this.props.updatePrivacy(this.state.selectedPrivacy, this.state.friendsSelected);
            });
        }
    };

    /**
     * Handle the change of the friend checkboxes.
     * It updates the list of friends selected.
     * It calls the callback function to update the privacy of the place.
     * @param e The event of the change.
     */
    handleFriendToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const friendName = e.target.value;
        const {selectedFriends} = this.state;

        //When the privacy changes, we fill the list friends with the friends from the user in the friendsList that are in the selectedFriends
        selectedFriends[friendName] = !selectedFriends[friendName];
        console.log(selectedFriends)
        const friendsSelected = this.state.friendsList.filter((friend) => selectedFriends[friend.getName() ?? ""]);

        this.setState({selectedFriends, friendsSelected}, () => {
            //When privacy is changed, the callback function is called to update the privacy of the place
            if (this.state.friendsButton) {
                this.props.updatePrivacy(this.state.selectedPrivacy, this.state.friendsSelected);
            } else {
                this.props.updatePrivacy(this.state.selectedPrivacy, []);
            }
        });
    };


    render() {
        return (
            <div className="privacy-visibility">
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
                </div>
                {/*Display the friends privacy options if friends option is checked*/}
                <div className="privacy-friends">
                    <div className="friends-options">
                        {/*Radio button for friends privacy*/}
                        <label className={`checkbox-option ${this.state.friendsButton ? "selected" : ""}`}>
                            <input
                                type="checkbox"
                                name="privacy"
                                value="friends"
                                checked={this.state.friendsButton}
                                onChange={this.handleFriendsChange}
                            />
                            Share with friends
                        </label>
                    </div>
                    {/*Display the friend checkboxes if friends privacy is selected*/}
                    {this.state.loadedFriends && this.state.friendsButton && (this.state.friendsList ?? []).length > 0 && (
                        <div className="friend-options">
                            {(this.state.friendsList ?? []).map((friend) => (
                                <label key={friend.getName() || friend.getWebId()}
                                       className={`checkbox-option ${this.state.selectedFriends[friend.getName() ??""] ? "selected" : ""}`}>
                                    <input
                                        type="checkbox"
                                        name="friends"
                                        value={friend.getName() ?? ""}
                                        checked={this.state.selectedFriends[friend.getName() ?? ""]}
                                        onChange={this.handleFriendToggle}
                                    />
                                    {friend.getName() || friend.simplfiedWebID()}
                                </label>
                            ))}
                        </div>
                    )}
                    {/*Display a message if there are no friends to select*/}
                    {this.state.loadedFriends && this.state.friendsButton && (this.state.friendsList ?? []).length == 0 && (
                        <div className="friend-options">
                            <p>You have no friends.</p>
                        </div>
                    )}
                    {!this.state.loadedFriends && this.state.friendsButton &&
                        <LoadingPage style={{left: "20%", padding: "1em"}} size={50}/>
                    }
                </div>
            </div>
        );
    }
}

export default PrivacyComponent;