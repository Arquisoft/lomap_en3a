import React from "react";
import * as CgIcon from "react-icons/cg";
//import SolidSessionManager from "../adapters/solid/SolidSessionManager";
import {getWebID} from "../adapters/solid/SolidSessionManager";
import LogoutButton from "./LogoutButton";
import 'rc-dropdown/assets/index.css';
import Dropdown from 'rc-dropdown';
import {IconContext} from "react-icons";
import Menu, {Divider, Item as MenuItem} from 'rc-menu';
import {Link} from "react-router-dom";

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
                    <Link style={this.menuItemStyle} to={getWebID()} className="MyProfile">
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
                      <IconContext.Provider value={{size: "4em"}}>
                          <CgIcon.CgProfile/>
                      </IconContext.Provider>
                  </span>
              </Dropdown>
          </div>
        );
    }
}