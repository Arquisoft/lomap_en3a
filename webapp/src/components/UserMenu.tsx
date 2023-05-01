import React from "react";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import LogoutButton from "./LogoutButton";
import 'rc-dropdown/assets/index.css';
import Dropdown from 'rc-dropdown';
import Menu, {Divider, Item as MenuItem} from 'rc-menu';
import {Link} from "react-router-dom";
import {Avatar} from "@mui/material";
import {TbAdjustmentsFilled} from "react-icons/tb";
import FriendManager from "../adapters/solid/FriendManager";
import User from "../domain/User";

/**
 * The menu with all the options related to the user (personal information, log out)
 */
export class UserMenu extends React.Component<any, { user: User | null }> {

    constructor(props: any) {
        super(props);

        this.state = {
            user: null
        }

        this.getUser().then((user) => {
            this.setState(({
                user: user
            }));
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
        return await new FriendManager().getUserData(SolidSessionManager.getManager().getWebID());
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
                              src={this.state.user?.photo != null ? this.state.user?.photo : undefined}
                              sx={{
                                  backgroundColor: "#B2CCEB",
                                  width: "4em",
                                  height: "4em",
                              }}>{SolidSessionManager.getManager().getWebID()?.charAt(8).toUpperCase()}</Avatar>
                  </span>
                </Dropdown>
            </div>
        );
    }
}