import React from "react";
import * as CgIcon from "react-icons/cg";
import * as HiIcon from "react-icons/hi";
import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import LogoutButton from "./LogoutButton";
import 'rc-dropdown/assets/index.css';
import Dropdown from 'rc-dropdown';
import {IconContext} from "react-icons";
import Menu, {Divider, Item as MenuItem} from 'rc-menu';
import {Link} from "react-router-dom";
import {Avatar} from "@mui/material";

/**
 * The menu with all the options related to the user (personal information, log out)
 */
export class UserMenu extends React.Component {
    private menuItemStyle = {
        display: "flex",
        justifyContent: "flex-end",
        textDecoration: "none",
        fontSize: "2em",
        color: "black",
        padding: "1em"
    };

    render() {
        const options = (
            <Menu>
                <MenuItem>
                    <Link style={this.menuItemStyle} to={SolidSessionManager.getManager().getWebID()} className="MyProfile">
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