import React from "react";
import FriendManager from "../adapters/solid/FriendManager";
import {PlaceCategory} from "../domain/place/PlaceCategory";
import '../styles/mapFilter.css';

interface MapfilterProps {
    callback: (categories: string[] | undefined) => void
}

interface MapFilterState {
    selectedCategories: Map<string, boolean>;
}

export default class MapFilter extends React.Component<MapfilterProps, MapFilterState> {

    private categories: string[] = Object.keys(PlaceCategory);
    private friendsManager: FriendManager = new FriendManager();

    public constructor(props: MapfilterProps) {
        super(props);
        let auxMap = new Map();
        for (const cat in this.categories) {
            auxMap.set(cat, false);
        }
        this.state = {
            selectedCategories: auxMap
        }

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
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

        this.setState(prevState => ({
            selectedCategories: prevState.selectedCategories.set(value, event.target.checked)
        }));
    }

    /**
     * Function to handle the submission of the filter
     * @param event
     * @private
     */
    private applyFilter(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let categories: string[] = [];
        for (let cat of this.categories) {
            if (this.state.selectedCategories.get(cat)) categories.push(cat)
        }
        this.props.callback(categories.length > 0 ? categories : undefined)
    }

    public render() {
        return <aside id="mapFilterComponent" className="mapFilterComponent">
            <h3>Filters</h3>
            <form onSubmit={this.applyFilter}>
                <h4>Category</h4>
                <div className="categoriesFilterContainer" style={{overflow: "scroll"}}>
                    {this.categories.map((item, index) =>
                        <p><input type="checkbox" value={item} name={item} onChange={this.handleCategoryChange}/>{item}
                        </p>
                    )}
                </div>
                <button style={{marginTop: "1em"}} className="search-filter" type="submit">Search</button>
            </form>
        </aside>
    }
}