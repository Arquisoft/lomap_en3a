import React from "react";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import LogoutButton from "./LogoutButton";
import 'rc-dropdown/assets/index.css';
import Dropdown from 'rc-dropdown';
import Menu, {Divider, Item as MenuItem} from 'rc-menu';
import {Link} from "react-router-dom";
import {Avatar, Button, Dialog, DialogActions, TextField} from "@mui/material";
import FriendManager from "../adapters/solid/FriendManager";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import OpenWeatherMapAdapter from "../adapters/OpenWeatherMapAdapter";

/**
 * The menu with all the options related to the user (personal information, log out)
 */
export class UserMenu extends React.Component<any, {
    photo: string | undefined,
    open: boolean,
    apiText: string | undefined,
    openConfirmationDialog: boolean
}> {

    // TODO: show message when api key empty
    // TODO maybe change the title of confirmation
    // button colors

    constructor(props: any) {
        super(props);

        this.state = {
            photo: undefined,
            open: false,
            apiText: OpenWeatherMapAdapter.getInstance().getAPIKey(),
            openConfirmationDialog: false
        }

        this.getUser().then((user) => {
            console.log(user);
            this.setState(({
                photo: user.photo
            }));
        });

        this.handleTextFieldAPIChange = this.handleTextFieldAPIChange.bind(this);
        this.changeAPIKeyWeather = this.changeAPIKeyWeather.bind(this);
    }

    private menuItemStyle = {
        display: "flex",
        justifyContent: "flex-end",
        textDecoration: "none",
        fontSize: "2em",
        color: "black",
        padding: "1em"
    };

    private async getUser() {
        return await new FriendManager().getUserData(SolidSessionManager.getManager().getWebID());
    }

    private changeAPIKeyWeather() {
        if (this.state.apiText != undefined) {
            OpenWeatherMapAdapter.getInstance().setAPIKey(this.state.apiText);
        }
        this.setState(({
            openConfirmationDialog: false
        }));
    }

    private handleTextFieldAPIChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target;
        const value = target.value;

        this.setState(({
            apiText: value
        }))
    }

    render() {
        const options = (
            <Menu>
                <MenuItem>
                    <Link style={this.menuItemStyle} to={SolidSessionManager.getManager().getWebID()}
                          className="MyProfile">
                        My profile
                    </Link>
                </MenuItem>
                <Divider/>
                <MenuItem>
                    <LogoutButton style={this.menuItemStyle}/>
                </MenuItem>
                <Divider/>
                <MenuItem>
                    <p onClick={() => {
                        this.setState(({
                            open: true
                        }));
                    }} style={{
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "flex-end",
                        fontSize: "2em",
                        color: "black",
                        padding: "1em"
                    }}>
                        Configuration
                    </p>
                </MenuItem>
            </Menu>
        )
        // return

        return (
            <div>
                <Dropdown trigger={[`click`]} overlay={options} animation="slide-up" placement="bottomRight">
                  <span>
                      <Avatar alt="User avatar"
                              src={this.state.photo}
                              sx={{
                                  backgroundColor: "#B2CCEB",
                                  width: "3.5em",
                                  height: "3.5em",
                                  marginTop: "0.5em",
                                  marginBottom: "0.5em"
                              }}>{SolidSessionManager.getManager().getWebID()?.charAt(8).toUpperCase()}</Avatar>
                  </span>
                </Dropdown>

                {/** Modal for configuration **/}

                <Modal open={this.state.open} onClose={() => this.setState(({open: false}))}>
                    <ModalDialog sx={{width: "30%"}}>
                        <ModalClose/>
                        <h1>Configuration</h1>
                        <label htmlFor={"apiKey"}>OpenWeatherMap Api Key</label>
                        <TextField id="apiKey" variant="standard"
                                   sx={{marginBottom: "1em"}} onChange={this.handleTextFieldAPIChange}
                                   value={this.state.apiText}/>
                        <Button onClick={() => {
                            this.setState(({
                                openConfirmationDialog: true
                            }));
                        }}>Change key</Button>
                    </ModalDialog>
                </Modal>

                {/** Confirmation dialog for API key change **/}

                <Dialog open={this.state.openConfirmationDialog} onClose={() => {
                    this.setState(({
                        openConfirmationDialog: false
                    }));
                }}>
                    <h2>Are you sure about changing your API key?</h2>
                    <DialogActions>
                        <Button onClick={this.changeAPIKeyWeather}>
                            Change
                        </Button>
                        <Button onClick={() => {
                            this.setState(({
                                openConfirmationDialog: false
                            }));
                        }}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}