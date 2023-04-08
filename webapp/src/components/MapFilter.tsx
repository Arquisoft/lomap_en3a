import React from "react";
import User from "../domain/User";
import '../styles/mapFilter.css';

interface MapfilterProps {
    // TODO maybe the user should be passed as a parameter ? to find the friends
    categories: string[]
}

interface MapFilterState {
    selectedCategories: Map<string, boolean>;
    selectedFriend: string;
}

export default class MapFilter extends React.Component<MapfilterProps, MapFilterState> {

    // TODO must change to the Categories class
    private categories: string[] = [];
    private friends: User[];

    public constructor(props: MapfilterProps) {
        super(props);
        this.friends = new Array();
        // TODO do a call to get the users friends

        // TODO Testing purposes only
        this.categories = props.categories;
        this.friends.push(new User("Pelayo", "123"));
        this.friends.push(new User("Carlos", "124"));

        this.state = {
            selectedCategories: new Map().set(this.categories[0], false).set(this.categories[1], false),
            selectedFriend: this.friends[0].getWebId()
        }

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleFriendChange = this.handleFriendChange.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
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

    private applyFilter(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        var a = this.state.selectedCategories;
        console.log(a);
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
                        {this.friends.map((friend, index) =>
                            <option id={friend.getWebId()} value={friend.getWebId()}>{friend.getName()}</option>
                        )}
                    </select>
                </div>
                <button type="submit">Search</button>
            </form>
        </aside>
    }
}