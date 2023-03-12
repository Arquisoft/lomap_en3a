import React from "react";
import '../styles/header.css';
import NavMenu from "./NavMenu";
import {UserMenu} from "./UserMenu";

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