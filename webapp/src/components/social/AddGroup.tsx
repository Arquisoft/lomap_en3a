import React, {ChangeEvent, FormEvent} from "react";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import {Button, Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {TextField} from "@mui/material";
import LoadingPage from "../basic/LoadingPage";
import PODManager from "../../adapters/solid/PODManager";
import Group from "../../domain/Group";
import SolidSessionManager from "../../adapters/solid/SolidSessionManager";
export default class AddGroup extends React.Component<{}, {
    friends: User[],
    selectedFriends: Map<string, boolean>,
    anySelected: boolean,
    allSelected: boolean,
    componentHasLoaded: boolean,
    groupTitle: string,
    error: string | null,
    isCreationDone: boolean,
    emptyList: JSX.Element
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            friends: [],
            selectedFriends: new Map(),
            anySelected: false,
            allSelected: false,
            componentHasLoaded: false,
            groupTitle: "",
            error: null,
            isCreationDone: false,
            emptyList: <p style={{marginLeft: "2em"}}>Your friend list is empty!</p>
        }

        this.getUserFriends().then(() => {
            this.setState(() => ({
                anySelected: false,
                allSelected: false
            }));
        })

        this.handleCheckboxCheck = this.handleCheckboxCheck.bind(this);
        this.handleCheckboxSelectAll = this.handleCheckboxSelectAll.bind(this);
        this.checkIfAllChecked = this.checkIfAllChecked.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createGroup = this.createGroup.bind(this);
    }

    private async getUserFriends() {
        let friends = await new FriendManager().getFriendsList();
        if (friends){
            friends.forEach(friend => {
                this.state.selectedFriends.set(friend.getWebId(), false);
            })
            this.setState(({friends: friends, componentHasLoaded: true}))
        }
        else {
            this.setState(({componentHasLoaded: true}))
        }
    }

    private handleCheckboxCheck(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.value;
        this.setState(prevState => ({
            selectedFriends: prevState.selectedFriends.set(value, event.target.checked)
        }));
        // We only check if all are checked if this one is checked!
        this.checkIfAllChecked(target.value, target.checked);
    }

    /**
     * Sets all the checkboxes as selected by iterating over the map of friends
     * and setting their value to true or false depending on the checked state of the box
     * @param {React.ChangeEvent<HTMLInputElement>} event
     * @private
     */
    private handleCheckboxSelectAll(event: React.ChangeEvent<HTMLInputElement>) {
        const all = this.state.selectedFriends;
        all.forEach((value, key, map) => {
            map.set(key, event.target.checked);
        });
        this.setState((prevState) => ({
            selectedFriends: all,
            allSelected: !prevState.allSelected,
            anySelected: false
        }));

    }

    private checkIfAllChecked(passedKey: string, value: boolean) {
        let all = true;
        let none = true;
        this.state.selectedFriends.forEach((value, key) => {
            if (key != passedKey) {
                if (!value) {
                    all = false;
                } else {
                    none = false;
                }
            }
        })
        if (all && value) {
            this.setState(({allSelected: true, anySelected: false}))
        } else if (none && !value) {
            this.setState(({allSelected: false, anySelected: false}))
        } else {
            this.setState(({allSelected: false, anySelected: true}))
        }

    }

    private createGroup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Check for possible wrong values
        if (this.state.groupTitle.trim().length == 0) {
            this.setState(({
                error: "The group name can not be empty"
            }));
        } else {
            let users: User[] = [];

            // Create the array of friends
            for (let friend in this.state.friends) {
                const webID = this.state.friends[friend].getWebId();
                if (this.state.selectedFriends.get(webID)) {
                    users.push(new User(null, webID));
                }
            }

            // Add this user to the group

            users.push(new User(null, SolidSessionManager.getManager().getWebID()));

            // Create the group
            let group = new Group(this.state.groupTitle, users);
            console.log(group);
            new PODManager().createGroup(group).then(() => {
                this.setState(({
                    isCreationDone: true
                }));
            });

            // Now we must tell the component to display loading again
            this.setState(({
                componentHasLoaded: false
            }));

        }

    }

    private handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;

        this.setState(({
            groupTitle: value
        }));
    }

    render() {

        // TODO to be changed
        if (this.state.isCreationDone) {
            return <div>
                <h2>Done!</h2>
            </div>
        }

        if (!this.state.componentHasLoaded) {
            return <div><LoadingPage size={100} style={{margin: "50% 0 50% 31%"}}/>
            </div>
        }

        // TODO do a cool error display :=)

        return (<div style={{overflow: "scroll"}}>
                <h2>{this.state.groupTitle.length > 0 ? this.state.groupTitle : "New Group"}</h2>
                <span><p>{this.state.error}</p></span>
                <form onSubmit={this.createGroup}>
                    <TextField
                        id="standard-basic"
                        name="group-name"
                        label="Group name"
                        variant="standard"
                        sx={{marginBottom: "1em"}}
                        onChange={this.handleInputChange}
                    />
                    <label htmlFor="friends-checkbox">Select the friends to add</label>
                    <div style={{
                        border: "2px solid gray",
                        borderRadius: "1em",
                        width: "15em",
                        paddingTop: "0.3em"
                    }}>{this.state.friends.length > 0 ?
                        <FormGroup id="friends-checkbox"
                                   style={{
                                       display: "flex",
                                       flexDirection: "row",
                                       width: "100%",
                                       height: "9em",
                                       overflow: "scroll",
                                       padding: "0.4em"
                                   }}>
                            <FormControlLabel
                                label="All"
                                control={
                                    <Checkbox checked={this.state.allSelected}
                                              indeterminate={this.state.anySelected}
                                              onChange={this.handleCheckboxSelectAll}
                                              sx={{width: "100%"}}
                                    />
                                }
                            />
                            {this.state.friends.map((user) => (
                                <FormControlLabel
                                    control={<Checkbox value={user.getWebId()}
                                                       onChange={this.handleCheckboxCheck}/>}
                                    label={user.getName()}
                                    checked={this.state.selectedFriends.get(user.getWebId()) || this.state.allSelected}
                                    sx={{width: "100%"}}/>
                            ))}
                        </FormGroup>
                        : this.state.emptyList}
                    </div>
                    <Button
                        sx={{marginTop: "1em", alignSelf: "end", height: "2em"}} size={"small"}
                        type={"submit"} variant={"contained"} color={"primary"}>Create</Button>
                </form>
            </div>
        );
    }
}
