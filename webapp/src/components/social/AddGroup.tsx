import React, {ChangeEvent} from "react";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import FriendManager from "../../adapters/solid/FriendManager";
import User from "../../domain/User";
import LoadingPage from "../basic/LoadingPage";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";


export default class AddGroup extends React.Component<{ open: boolean }, {
    open: boolean,
    friends: User[],
    selectedFriends: Map<string, boolean>
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            open: this.props.open,
            friends: [],
            selectedFriends: new Map()
        }

        // Redundant? TODO
        this.getUserFriends().then(() => {
            this.setState(({open: true}));
        });
    }

    private async getUserFriends() {
        this.setState(({friends: await new FriendManager().getFriendsList()}))
    }

    private handleCheckboxCheck(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.value;

        this.setState(prevState => ({
            selectedFriends: prevState.selectedFriends.set(value, event.target.checked)
        }));
    }

    private handleCheckboxSelectAll(event: React.ChangeEvent<HTMLInputElement>) {

        const all = this.state.selectedFriends;
        all.forEach((value, key, map) => {
            map.set(key, true);
        });

        this.setState(() => ({
            selectedFriends: all
        }));

    }

    render() {

        if (this.state.friends.length == 0) {
            return <LoadingPage></LoadingPage>
        }

        return (
            <Modal open={this.state.open} onClose={() => this.setState(({open: false}))}>
                <ModalDialog>
                    <ModalClose accessKey={"x"}/>
                    <form>
                        <FormGroup>
                            <FormControlLabel
                                label="All"
                                control={
                                    <Checkbox
                                        onChange={this.handleCheckboxSelectAll}
                                    />
                                }
                            />
                            {this.state.friends.map((user, index) => (
                                <FormControlLabel
                                    control={<Checkbox value={user.getWebId()} onChange={this.handleCheckboxCheck}/>}
                                    label={user.getName()}/>
                            ))}
                        </FormGroup>
                    </form>
                </ModalDialog>
            </Modal>
        );
    }

}
