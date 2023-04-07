import React from "react";
import User from "../domain/User";
import '../styles/mapFilter.css';

interface MapfilterProps {
    // TODO maybe the user should be passed as a parameter ?
}

interface MapFilterState {
    category: string;
    selectedFriend: string;
}

export default class MapFilter extends React.Component<MapfilterProps, MapFilterState> {

    // TODO must change to the Categories class
    private categories: string[] = new Array();
    private friends: User[];

    public constructor(props: MapfilterProps) {
        super(props);
        this.friends = new Array();
        // TODO do a call to get the users friends

        // TODO Testing purposes only
        this.categories.push("Restaurant");
        this.friends.push(new User("Pelayo", "123"));
        this.friends.push(new User("Carlos", "124"));

        this.setState({category: this.categories[0], selectedFriend: "Pelayo"});

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleFriendChange = this.handleFriendChange.bind(this);
    }

    /** Will asign the selected category to the field when changed
     *
     * @param event
     * @private
     */
    private handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;
        const category = this.state.category;

        this.setState({
            [category]: value,
        } as unknown as Pick<MapFilterState, keyof MapFilterState>);
    }

    /**
     * Will asign the selecte friend to the filed when changed
     * @param event
     * @private
     */
    private handleFriendChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;
        const selectedFriend = this.state.selectedFriend;
        console.log(value)
        this.setState({
            [selectedFriend]: value,
        } as unknown as Pick<MapFilterState, keyof MapFilterState>);
    }

    private applyFilter() {
        // NEEDS FIX
        let cat = this.state.category;
        console.log(cat);
        let fr = this.state.selectedFriend;
        console.log(fr);
        // TODO handle the map filtering
    }

    public render() {
        return <aside>
            <h3>Filters</h3>
            <label htmlFor="categories">Category</label>
            <select name="categories" id="categories" onChange={this.handleCategoryChange}>
                {this.categories.map((item, index) =>
                    <option id={index.toString()} value={item}>{item}</option>
                )}
            </select>
            <label htmlFor="friends">Friend</label>
            <select name="friends" id="friends" onChange={this.handleFriendChange}>
                {this.friends.map((friend, index) =>
                    <option id={friend.getWebId()} value={friend.getWebId()}>{friend.getName()}</option>
                )}
            </select>
            <button onClick={this.applyFilter}>Search</button>
        </aside>;
    }
}