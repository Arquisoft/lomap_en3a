import React from "react";
import FriendManager from "../adapters/solid/FriendManager";
import User from "../domain/User";
import '../styles/mapFilter.css';

interface MapfilterProps {
    categories: string[]
}

interface MapFilterState {
    selectedCategories: Map<string, boolean>;
    selectedFriend: string;
}

export default class MapFilter extends React.Component<MapfilterProps, MapFilterState> {

    private categories: string[] = [];
    private friends: User[];
    private friendsManager: FriendManager = new FriendManager();

    public constructor(props: MapfilterProps) {
        super(props);
        this.friends = new Array();

        this.getFriends().then(() => {
            this.setState(() => ({
                selectedCategories: new Map().set(this.categories[0], false).set(this.categories[1], false),
                selectedFriend: this.friends.length > 0 ? this.friends[0].getWebId() : "No friends"
            }));
        }).catch(() => {
            this.state = {
                selectedCategories: new Map().set(this.categories[0], false).set(this.categories[1], false),
                selectedFriend: (this.friends[0] != null ? this.friends[0].getWebId() : "")
            }
        });

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleFriendChange = this.handleFriendChange.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    /**
     * Just a small function to get the friends of the user
     * @private
     */
    private async getFriends() {
        this.friends = await this.friendsManager.getFriendsList();
    }

    /** Will asign the selected category to the field when changed
     *
     * @param event
     * @private
     */
    handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.value;
        const category = target.value;

        this.setState(prevState => ({
            selectedCategories: prevState.selectedCategories.set(value, event.target.checked)
        }));
    }

    /**
     * Will asign the selecte friend to the filed when changed
     * @param event
     * @private
     */
    private handleFriendChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;
        const selectedFriend = target.value;

        this.setState({
            selectedFriend: value,
        } as unknown as Pick<MapFilterState, keyof MapFilterState>);
    }

    /**
     * Function to handle the submit of the filter
     * @param event
     * @private
     */
    private applyFilter(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        var a = this.state.selectedCategories;
        // TODO handle the map filtering
    }

    public render() {
        return <aside>
            <h3>Filters</h3>
            <form onSubmit={this.applyFilter}>
                <h4>Category</h4>
                <div className="categoriesFilterContainer">
                    {this.categories.map((item, index) =>
                        <p><input type="checkbox" value={item} name={item} onChange={this.handleCategoryChange}/>{item}
                        </p>
                    )}
                </div>
                <div className="friendsFilterContainer">
                    <label htmlFor="friends">Friend</label>
                    <select name="friends" id="friends" onChange={this.handleFriendChange}>
                        <option value="None">None</option>
                        {this.friends.map((friend, index) =>
                            <option value={friend.getWebId()}>{friend.getName()}</option>
                        )}
                    </select>
                </div>
                <button type="submit">Search</button>
            </form>
        </aside>
    }
}