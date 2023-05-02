import React from "react";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import LogoutButton from "./LogoutButton";
import 'rc-dropdown/assets/index.css';
import Dropdown from 'rc-dropdown';
import Menu, {Divider, Item as MenuItem} from 'rc-menu';
import {Link} from "react-router-dom";
import {Avatar} from "@mui/material";
import FriendManager from "../adapters/solid/FriendManager";

/**
 * The menu with all the options related to the user (personal information, log out)
 */
export class UserMenu extends React.Component<any, { photo: string | undefined }> {

    constructor(props: any) {
        super(props);

        this.state = {
            photo: undefined
        }

        this.getUser().then((user) => {
            console.log(user);
            this.setState(({
                photo: user.photo
            }));
            console.log(this.state.photo)
        });
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
        return await new FriendManager().getUserData(SolidSessionManager.getManager().getWebID().replace("profile/card#me",""));
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
            </div>
        );
    }
}