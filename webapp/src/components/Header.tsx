import React, {useState} from "react";
import '../styles/header.css';
import NavMenu from "./NavMenu";

const Header: React.FunctionComponent = () => {
    return (
        <header className="Header">
            <div className="Left">
                <h1>LoMap</h1>
                <NavMenu/>
            </div>
        </header>
    )
}
export default Header