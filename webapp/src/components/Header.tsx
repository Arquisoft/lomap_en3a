import React from "react";
import '../styles/header.css';
import NavMenu from "./NavMenu";
import {UserMenu} from "./UserMenu";

/**
 * It contains the header, with the name of the app, the navigation menu
 * and the user menu.
 */
const Header: React.FunctionComponent = () => {
    return (
        <header className="Header">
            <div className="Left">
                <h1>LoMap</h1>
                <NavMenu/>
            </div>
            <div className="Right">
                <UserMenu/>
            </div>
        </header>
    )
}
export default Header