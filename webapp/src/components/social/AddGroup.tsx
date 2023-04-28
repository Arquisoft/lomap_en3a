import React, {ChangeEvent} from "react";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import {Button, Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {TextField} from "@mui/material";
import LoadingPage from "../basic/LoadingPage";


export default class AddGroup extends React.Component<{}, {
    friends: User[],
    selectedFriends: Map<string, boolean>,
    anySelected: boolean,
    allSelected: boolean
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            friends: [],
            selectedFriends: new Map(),
            anySelected: false,
            allSelected: false
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
    }

    private async getUserFriends() {
        let friends = await new FriendManager().getFriendsList();
        friends.forEach(friend => {
            this.state.selectedFriends.set(friend.getWebId(), false);
        })
        this.setState(({friends: friends}))
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

    render() {

        if (this.state.friends.length == 0) {
            return <div><LoadingPage size={100} style={{margin: "50% 0 50% 31%"}}/>
            </div>
        }

        return (<div style={{overflow: "scroll"}}>
                <h2>New Group</h2>
                <form>
                    <TextField
                        id="standard-basic"
                        name="group-name"
                        label="Group name"
                        variant="standard"
                        sx={{marginBottom: "1em"}}
                    />
                    <label htmlFor="friends-checkbox">Select the friends to add</label>
                    <div style={{
                        border: "2px solid gray",
                        borderRadius: "1em",
                        width: "15em",
                        paddingTop: "0.3em"
                    }}>
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
                    </div>
                    <Button
                        sx={{marginTop: "1em", alignSelf: "end", height: "2em"}} size={"small"}
                        type={"submit"} variant={"contained"} color={"primary"}>Create</Button>
                </form>
            </div>
        );
    }
}
